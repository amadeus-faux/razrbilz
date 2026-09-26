import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createDuitkuTransaction } from "@/lib/duitku";
import { generateOrderNumber } from "@/lib/utils";
import { resolveDisplayPrice, isInternational } from "@/lib/pricing";
import { getActiveExchangeRate } from "@/lib/exchange-rate";
import {
  getServerShippingRates,
  getInternationalShippingCost,
  findMatchingRate,
  INTERNATIONAL_COURIER,
} from "@/lib/shipping-cost";

interface CheckoutItem {
  productId: string;
  size: string;
  quantity: number;
  priceAtBuy?: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      email,
      phone,
      country = "ID",
      province,
      address,
      apartment,
      district,
      city,
      stateProvince,
      postalCode,
      courier,
      courierCode,
      courierServiceCode,
      items,
      paymentMethod,
      exchangeRateUsed,
    } = body as {
      customerName: string;
      email: string;
      phone: string;
      country?: string;
      province?: string;
      address: string;
      apartment?: string;
      district?: string;
      city: string;
      stateProvince?: string;
      postalCode: string;
      courier: string;
      courierCode?: string;
      courierServiceCode?: string;
      items: CheckoutItem[];
      paymentMethod?: string;
      exchangeRateUsed?: number;
    };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Keranjang belanja kosong" },
        { status: 400 }
      );
    }

    // 2.2 Validasi quantity ketat di SERVER, sebelum cek stok & perhitungan total.
    //     Harus integer, minimal 1, dan ada batas maksimum wajar per produk.
    const MAX_QTY_PER_PRODUCT = 5;
    for (const item of items) {
      const q = item.quantity;
      if (typeof q !== "number" || !Number.isInteger(q) || q < 1) {
        return NextResponse.json(
          { error: "Quantity setiap item harus berupa bilangan bulat minimal 1." },
          { status: 400 }
        );
      }
    }

    const orderCountry = (country || "ID").trim().toUpperCase();
    const activeRate = await getActiveExchangeRate();
    const orderNumber = generateOrderNumber();
    const EXPIRY_MINUTES = 60;

    // 6.2: Validasi kurs yang dipakai client vs kurs aktif server. Hanya relevan
    // untuk order internasional (harga domestik ID tidak bergantung kurs). Kalau
    // admin baru mengubah kurs, total yang dilihat customer di halaman checkout
    // bisa beda jauh dari tagihan sebenarnya — tolak dan minta refresh dulu.
    if (isInternational(orderCountry)) {
      const clientRate = Number(exchangeRateUsed);
      if (Number.isFinite(clientRate) && clientRate > 0 && activeRate > 0) {
        const RATE_DRIFT_TOLERANCE = 0.02; // 2%
        const drift = Math.abs(clientRate - activeRate) / activeRate;
        if (drift > RATE_DRIFT_TOLERANCE) {
          return NextResponse.json(
            {
              error:
                "Kurs konversi baru saja diperbarui. Silakan muat ulang halaman checkout untuk melihat total terbaru sebelum memesan.",
              code: "RATE_CHANGED",
            },
            { status: 409 }
          );
        }
      }
    }

    // 1. Calculate total quantities required per product (regardless of size)
    const productQuantities = new Map<string, number>();
    for (const item of items) {
      const curr = productQuantities.get(item.productId) || 0;
      productQuantities.set(item.productId, curr + item.quantity);
    }

    for (const [, totalQty] of productQuantities) {
      if (totalQty > MAX_QTY_PER_PRODUCT) {
        return NextResponse.json(
          { error: `Maksimum ${MAX_QTY_PER_PRODUCT} item per produk dalam satu pesanan.` },
          { status: 400 }
        );
      }
    }

    // 2.1 Ongkir SELALU ditentukan server, tidak pernah dari body client.
    //     - Internasional: flat rate dari tabel server (lookup by negara).
    //     - Domestik (ID): re-quote Biteship di server, cocokkan dengan kurir+layanan
    //       yang dipilih buyer, lalu pakai harga hasil hitungan server.
    let serverShippingCost = 0;
    if (isInternational(orderCountry)) {
      // 2.3 Untuk tujuan internasional hanya kurir internasional yang valid.
      //     Tolak kalau buyer (atau request rekayasa) mengirim kurir domestik.
      if (courierCode && courierCode !== INTERNATIONAL_COURIER.courier_code) {
        return NextResponse.json(
          { error: "Kurir yang dipilih tidak berlaku untuk pengiriman internasional. Silakan pilih ulang." },
          { status: 400 }
        );
      }
      serverShippingCost = getInternationalShippingCost(orderCountry);
    } else {
      // 2.3 Tolak kurir internasional untuk alamat domestik.
      if (courierCode === INTERNATIONAL_COURIER.courier_code) {
        return NextResponse.json(
          { error: "Kurir internasional tidak berlaku untuk alamat domestik. Silakan pilih ulang kurir." },
          { status: 400 }
        );
      }
      // 2.5: quote pakai berat asli per produk dari DB (bukan hardcode 350 g),
      // dijumlahkan sesuai quantity tiap baris item.
      const quoteProducts = await prisma.product.findMany({
        where: { id: { in: Array.from(productQuantities.keys()) } },
        select: { id: true, name: true, weightGrams: true },
      });
      const quoteProductById = new Map(quoteProducts.map((p) => [p.id, p]));
      const quote = await getServerShippingRates({
        country: orderCountry,
        destinationPostalCode: postalCode,
        items: items.map((it) => {
          const p = quoteProductById.get(it.productId);
          return {
            name: p?.name,
            quantity: it.quantity,
            weightGrams: p?.weightGrams,
          };
        }),
      });
      if (!quote.ok) {
        return NextResponse.json({ error: quote.error }, { status: 400 });
      }
      const matched = findMatchingRate(
        quote.rates,
        courierCode || "",
        courierServiceCode || ""
      );
      if (!matched) {
        return NextResponse.json(
          { error: "Opsi pengiriman yang dipilih tidak tersedia. Silakan pilih ulang kurir." },
          { status: 400 }
        );
      }
      serverShippingCost = matched.price;
    }

    // 2. Atomically verify stock, calculate server prices, decrement stock, and create order
    console.log(`[Checkout] Processing order ${orderNumber} in atomic transaction for region ${orderCountry}...`);
    const { order, isPreOrder, validatedItems, serverTotal } = await prisma.$transaction(async (tx) => {
      const productMap = new Map<string, { id: string; name: string; price: number; stock: number; isPreOrder: boolean; images: string[] }>();

      // Verify and atomically decrement stock for each unique product
      for (const [productId, requiredQty] of productQuantities.entries()) {
        const product = await tx.product.findUnique({
          where: { id: productId },
          select: { id: true, name: true, price: true, stock: true, isActive: true, isPreOrder: true, images: true },
        });

        if (!product || !product.isActive) {
          throw new Error(`Produk tidak ditemukan atau sedang tidak aktif.`);
        }

        if (product.stock < requiredQty) {
          throw new Error(
            `Stok untuk "${product.name}" tidak mencukupi (tersedia: ${product.stock}, diminta: ${requiredQty}).`
          );
        }

        // Atomic update with stock >= requiredQty condition to prevent race conditions
        const updateResult = await tx.product.updateMany({
          where: {
            id: productId,
            stock: { gte: requiredQty },
            isActive: true,
          },
          data: {
            stock: { decrement: requiredQty },
          },
        });

        if (updateResult.count === 0) {
          throw new Error(
            `Stok produk "${product.name}" baru saja habis atau tidak mencukupi. Silakan coba kembali.`
          );
        }

        productMap.set(productId, product);
      }

      // Calculate authoritative server prices for each item
      const resolvedItems = items.map((item) => {
        const prod = productMap.get(item.productId);
        if (!prod) {
          throw new Error(`Produk ${item.productId} tidak valid`);
        }
        const unitPrice = resolveDisplayPrice(prod.price, orderCountry, activeRate);
        return {
          productId: item.productId,
          name: prod.name,
          image: prod.images?.[0] || null,
          size: item.size,
          quantity: item.quantity,
          priceAtBuy: unitPrice,
        };
      });

      const serverSubtotal = resolvedItems.reduce(
        (sum, item) => sum + item.priceAtBuy * item.quantity,
        0
      );
      const computedTotal = serverSubtotal + serverShippingCost;

      const orderIsPreOrder = Array.from(productMap.values()).some((p) => p.isPreOrder);
      const expiredAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName,
          email,
          phone,
          country: orderCountry,
          priceRegion: orderCountry,
          exchangeRate: isInternational(orderCountry) ? activeRate : null,
          province: province || "",
          stateProvince: stateProvince || null,
          city,
          district: district || "",
          shippingAddress: address,
          apartment: apartment || null,
          postalCode,
          courier,
          shippingCost: serverShippingCost,
          subtotal: serverSubtotal,
          total: computedTotal,
          paymentStatus: "pending",
          orderStatus: "order_received",
          expiredAt,
          isPreOrder: orderIsPreOrder,
          items: {
            create: resolvedItems.map((item) => ({
              productId: item.productId,
              size: item.size,
              quantity: item.quantity,
              priceAtBuy: item.priceAtBuy,
              productNameSnapshot: item.name,
              productImageSnapshot: item.image,
            })),
          },
        },
      });

      return {
        order: createdOrder,
        isPreOrder: orderIsPreOrder,
        validatedItems: resolvedItems,
        serverTotal: computedTotal,
      };
    });

    const orderId = order.id;
    console.log(`[Checkout] Order ${orderNumber} (ID: ${order.id}) created and stock decremented successfully.`);

    const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_BASE_URL;
    if (!appUrl) {
      throw new Error("APP_URL atau NEXT_PUBLIC_BASE_URL wajib diisi untuk callback Duitku.");
    }

    const chosenMethod = paymentMethod || process.env.DUITKU_PAYMENT_METHOD || "VA";
    let transaction: Awaited<ReturnType<typeof createDuitkuTransaction>> | null = null;

    try {
      const duitkuItems = validatedItems.map((item) => ({
        name: `Produk RAZRBILZ (${item.size})`,
        price: item.priceAtBuy,
        quantity: item.quantity,
      }));

      if (serverShippingCost > 0) {
        duitkuItems.push({
          name: `Ongkir ${courier}`.slice(0, 255),
          price: serverShippingCost,
          quantity: 1,
        });
      }

      transaction = await createDuitkuTransaction({
        merchantOrderId: orderNumber,
        paymentAmount: serverTotal,
        paymentMethod: chosenMethod,
        productDetails: `Pembayaran pesanan RAZRBILZ ${orderNumber}`,
        customerName,
        email,
        phoneNumber: phone,
        address,
        city,
        postalCode,
        countryCode: country || "ID",
        items: duitkuItems,
        callbackUrl: `${appUrl}/api/payments/duitku/callback`,
        returnUrl: `${appUrl}/payment/instructions/${encodeURIComponent(orderNumber)}`,
        expiryPeriod: EXPIRY_MINUTES,
      });

      await prisma.order.update({
        where: { orderNumber },
        data: {
          duitkuReference: transaction.reference,
          duitkuPaymentMethod: chosenMethod,
          duitkuPaymentUrl: transaction.paymentUrl || null,
          duitkuVaNumber: transaction.vaNumber || null,
          duitkuQrString: transaction.qrString || null,
          duitkuPaymentCode: transaction.paymentCode || null,
          duitkuStatusMessage: transaction.statusMessage,
        },
      });
      // Diagnostik: field apa saja yang DITAK-tidak dikembalikan Duitku per metode.
      // Membantu memastikan retail (Indomaret/Alfamart) mengembalikan paymentCode
      // vs vaNumber, tanpa membocorkan nilai sensitif ke log.
      console.log(
        `[Checkout] Duitku inquiry OK for ${orderNumber}: method=${chosenMethod} ` +
          `va=${Boolean(transaction.vaNumber)} qr=${Boolean(transaction.qrString)} ` +
          `code=${Boolean(transaction.paymentCode)} url=${Boolean(transaction.paymentUrl)}`
      );
    } catch (duitkuError) {
      console.error(`[Checkout] Duitku V2 error for ${orderNumber}:`, duitkuError);
      // 7.4: Kompensasi (revert stok + hapus order) TIDAK boleh menelan error
      // diam-diam. Kalau kompensasi gagal, order bisa "nyangkut" dengan stok
      // terpotong tanpa pembayaran — wajib ada jejak log untuk investigasi manual.
      for (const [productId, requiredQty] of productQuantities.entries()) {
        try {
          await prisma.product.update({
            where: { id: productId },
            data: { stock: { increment: requiredQty } },
          });
        } catch (revertErr) {
          console.error(
            `[Checkout] ⚠️ KOMPENSASI GAGAL: tidak bisa mengembalikan stok produk ${productId} (qty ${requiredQty}) untuk order ${orderNumber} (orderId ${order.id}). Stok mungkin terpotong tanpa pembayaran — perlu rekonsiliasi manual.`,
            revertErr
          );
        }
      }
      try {
        await prisma.order.delete({ where: { id: order.id } });
      } catch (deleteErr) {
        console.error(
          `[Checkout] ⚠️ KOMPENSASI GAGAL: tidak bisa menghapus order ${orderNumber} (orderId ${order.id}) setelah Duitku error. Order pending mungkin menggantung — perlu rekonsiliasi manual.`,
          deleteErr
        );
      }
      throw new Error(
        duitkuError instanceof Error ? duitkuError.message : "Gagal menghubungkan ke Duitku."
      );
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      paymentStatus: "pending",
      paymentInstructionsUrl: `/payment/instructions/${orderNumber}`,
      reference: transaction?.reference || null,
      paymentMethod: chosenMethod,
      paymentUrl: transaction?.paymentUrl || null,
      vaNumber: transaction?.vaNumber || null,
      qrString: transaction?.qrString || null,
      paymentCode: transaction?.paymentCode || null,
      amount: serverTotal,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Gagal memproses pesanan",
      },
      { status: 500 }
    );
  }
}
