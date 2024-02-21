import { z } from "zod";

export let CreateSellerSchema = z.object({
  id: z.string().optional(),
  fullname: z.string().min(2).max(50),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  image: z.string().optional(),
  credi: z.number().optional(),
});

export type SellerT = z.infer<typeof CreateSellerSchema>;
