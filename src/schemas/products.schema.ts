import { z } from "zod";

export let CreateProductSchema = z.object({
  name: z.string().min(2).max(50),
  price: z.number().min(0),
  image: z.string().optional(),
  description: z.string().min(2),
  minQuantity: z.number().min(0),
});

export type ProductT = z.infer<typeof CreateProductSchema> & {
  id?: string;
};

export type dbProductT = ProductT & {
  createdAt: string;
  stock: number;
};
