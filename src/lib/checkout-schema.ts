import { z } from "zod";

export const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  customerName: z.string().optional(),
  email: z.string().email("Please enter a valid email"),
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 digits")
    .max(20, "Phone number must not exceed 20 digits"),
  country: z.string().min(2, "Country is required"),
  province: z.string().min(1, "Province is required"),
  address: z
    .string()
    .min(3, "Address is required")
    .max(500, "Address is too long"),
  apartment: z.string().optional(),
  district: z.string().optional(),
  city: z
    .string()
    .min(2, "City is required")
    .max(100, "City is too long"),
  postalCode: z
    .string()
    .min(3, "Postal code is required")
    .max(10, "Postal code is too long"),
  newsOffers: z.boolean().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
