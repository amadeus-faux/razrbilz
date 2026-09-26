import { z } from "zod";

/**
 * Pesan validasi disimpan sebagai KUNCI dictionary (lihat `translateMessage` di
 * `checkout-i18n.ts`), bukan teks jadi, supaya field error ikut berganti bahasa
 * mengikuti negara pengiriman tanpa perlu merekonstruksi schema per locale.
 */
export const checkoutSchema = z.object({
  firstName: z.string().min(1, "errFirstName"),
  lastName: z.string().optional(),
  customerName: z.string().optional(),
  email: z.string().email("errEmail"),
  phone: z
    .string()
    .min(8, "errPhoneMin")
    .max(20, "errPhoneMax"),
  country: z.string().min(2, "errCountry"),
  province: z.string().min(1, "errProvince"),
  address: z
    .string()
    .min(3, "errAddress")
    .max(500, "errAddressLong"),
  apartment: z.string().optional(),
  district: z.string().optional(),
  city: z
    .string()
    .min(2, "errCity")
    .max(100, "errCityLong"),
  postalCode: z
    .string()
    .min(3, "errPostal")
    .max(10, "errPostalLong"),
  newsOffers: z.boolean().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
