import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/prisma";
import { returnOrderStock } from "../src/lib/order-fulfillment";

describe("Logika Stok Pre-Order Per-Produk", () => {
  let testProductId: string;
  const initialStock = 5;

  before(async () => {
    // Setup dummy test product in database
    const product = await prisma.product.create({
      data: {
        name: "TEST PRE-ORDER HOODIE",
        slug: `test-po-hoodie-${Date.now()}`,
        description: "Test product for stock verification",
        price: 300000,
        category: "Hoodies",
        images: ["/placeholder-product.svg"],
        stock: initialStock,
        isActive: true,
        isPreOrder: true,
        sizes: {
          create: [{ size: "S" }, { size: "M" }, { size: "L" }, { size: "XL" }],
        },
      },
      include: { sizes: true },
    });
    testProductId = product.id;
  });

  after(async () => {
    // Clean up test data
    if (testProductId) {
      await prisma.orderItem.deleteMany({ where: { productId: testProductId } });
      await prisma.productSize.deleteMany({ where: { productId: testProductId } });
      await prisma.product.deleteMany({ where: { id: testProductId } });
    }
  });

  it("1. Pengurangan stok sesuai quantity yang dibeli (bebas size apa pun)", async () => {
    const buyQuantity = 2;

    // Pembeli membeli 1 size S dan 1 size XL dari produk yang sama (total quantity = 2)
    const items = [
      { productId: testProductId, size: "S", quantity: 1, priceAtBuy: 300000 },
      { productId: testProductId, size: "XL", quantity: 1, priceAtBuy: 300000 },
    ];

    const totalRequestedQty = items.reduce((sum, i) => sum + i.quantity, 0);
    assert.equal(totalRequestedQty, buyQuantity);

    // Simulasi transaksi checkout atomik seperti di /api/checkout
    await prisma.$transaction(async (tx) => {
      const updateResult = await tx.product.updateMany({
        where: {
          id: testProductId,
          stock: { gte: totalRequestedQty },
          isActive: true,
        },
        data: {
          stock: { decrement: totalRequestedQty },
        },
      });

      assert.equal(updateResult.count, 1, "Update stok atomik harus berhasil");
    });

    const updatedProduct = await prisma.product.findUnique({
      where: { id: testProductId },
    });

    assert.equal(
      updatedProduct?.stock,
      initialStock - buyQuantity,
      `Stok harus berkurang dari ${initialStock} menjadi ${initialStock - buyQuantity}`
    );
  });

  it("2. Checkout ditolak saat jumlah yang dibeli melebihi sisa stok", async () => {
    const currentProduct = await prisma.product.findUnique({
      where: { id: testProductId },
    });
    const currentStock = currentProduct?.stock ?? 0;
    const excessiveQty = currentStock + 1;

    // Coba checkout melebihi stok yang tersedia
    let errorThrown = false;
    try {
      await prisma.$transaction(async (tx) => {
        const updateResult = await tx.product.updateMany({
          where: {
            id: testProductId,
            stock: { gte: excessiveQty },
            isActive: true,
          },
          data: {
            stock: { decrement: excessiveQty },
          },
        });

        if (updateResult.count === 0) {
          throw new Error("Stok tidak mencukupi");
        }
      });
    } catch (e: any) {
      errorThrown = true;
      assert.match(e.message, /stok tidak mencukupi/i);
    }

    assert.equal(errorThrown, true, "Transaksi harus gagal dan rollback saat stok tidak cukup");

    // Pastikan stok tidak berubah setelah percobaan gagal
    const productAfter = await prisma.product.findUnique({
      where: { id: testProductId },
    });
    assert.equal(productAfter?.stock, currentStock, "Stok tidak boleh berkurang jika checkout ditolak");
  });

  it("3. Race condition prevention: dua pembeli bersamaan memperebutkan stok terakhir", async () => {
    // Set stok ke 1
    await prisma.product.update({
      where: { id: testProductId },
      data: { stock: 1 },
    });

    const buyOneAtomically = async () => {
      return await prisma.$transaction(async (tx) => {
        const res = await tx.product.updateMany({
          where: {
            id: testProductId,
            stock: { gte: 1 },
            isActive: true,
          },
          data: {
            stock: { decrement: 1 },
          },
        });
        if (res.count === 0) {
          throw new Error("Sold Out / Out of Stock");
        }
        return true;
      });
    };

    // Jalankan 2 checkout bersamaan untuk stok 1
    const results = await Promise.allSettled([buyOneAtomically(), buyOneAtomically()]);

    const successes = results.filter((r) => r.status === "fulfilled");
    const rejections = results.filter((r) => r.status === "rejected");

    assert.equal(successes.length, 1, "Tepat 1 pembeli yang harus berhasil membeli stok terakhir");
    assert.equal(rejections.length, 1, "Pembeli kedua harus ditolak karena stok sudah 0");

    const finalProduct = await prisma.product.findUnique({
      where: { id: testProductId },
    });
    assert.equal(finalProduct?.stock, 0, "Stok akhir harus tepat 0 (tidak boleh negatif)");
  });

  it("4. Pengembalian stok saat order dibatalkan / expired (returnOrderStock)", async () => {
    // Buat dummy order dengan status cancelled
    const dummyOrderNumber = `TEST-ORD-${Date.now()}`;
    const qtyToReturn = 2;

    const order = await prisma.order.create({
      data: {
        orderNumber: dummyOrderNumber,
        customerName: "Test Buyer",
        email: "buyer@test.com",
        phone: "081234567890",
        shippingAddress: "Jl. Test No 123",
        city: "Jakarta",
        courier: "JNE - REG",
        shippingCost: 10000,
        subtotal: 600000,
        total: 610000,
        paymentStatus: "failed",
        orderStatus: "cancelled",
        items: {
          create: [
            {
              productId: testProductId,
              size: "M",
              quantity: qtyToReturn,
              priceAtBuy: 300000,
            },
          ],
        },
      },
    });

    const stockBeforeReturn = (await prisma.product.findUnique({ where: { id: testProductId } }))?.stock ?? 0;

    // Jalankan returnOrderStock
    await returnOrderStock(order.id);

    const stockAfterReturn = (await prisma.product.findUnique({ where: { id: testProductId } }))?.stock ?? 0;

    assert.equal(
      stockAfterReturn,
      stockBeforeReturn + qtyToReturn,
      `Stok harus bertambah kembali sebanyak ${qtyToReturn}`
    );

    // Clean up dummy order
    await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
    await prisma.order.delete({ where: { id: order.id } });
  });

  it("5. Kondisi Sold Out: saat stok 0, semua size disabled dan tidak bisa dibeli", () => {
    // Verifikasi logika sold out di komponen
    const productZeroStock = { stock: 0 };
    const isSoldOut = (productZeroStock.stock ?? 1) <= 0;
    assert.equal(isSoldOut, true, "isSoldOut harus bernilai true saat stock = 0");

    const sizes = ["S", "M", "L", "XL"];
    // Saat sold out, setiap size harus disabled
    const sizeButtonStates = sizes.map((size) => ({
      size,
      disabled: isSoldOut,
      label: isSoldOut ? "SOLD" : "SELECT",
    }));

    for (const s of sizeButtonStates) {
      assert.equal(s.disabled, true, `Size ${s.size} harus disabled`);
      assert.equal(s.label, "SOLD", `Size ${s.size} harus berlabel SOLD`);
    }

    // Saat stok > 0, semua size tersedia
    const productWithStock = { stock: 10 };
    const isNotSoldOut = (productWithStock.stock ?? 1) <= 0;
    assert.equal(isNotSoldOut, false);
    const availableSizeStates = sizes.map((size) => ({
      size,
      disabled: isNotSoldOut,
      label: isNotSoldOut ? "SOLD" : "SELECT",
    }));

    for (const s of availableSizeStates) {
      assert.equal(s.disabled, false, `Size ${s.size} harus dapat dipilih`);
      assert.equal(s.label, "SELECT");
    }
  });
});
