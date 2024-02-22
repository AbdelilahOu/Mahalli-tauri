import { z } from "zod";

export const CreateOrderSchema = z.object({
  id: z.string().optional(),
  status: z.string().min(2).max(50),
  supplierId: z.string().optional(),
});

export type OrderT = z.infer<typeof CreateOrderSchema> & {
  fullname?: string;
  products?: number;
  total?: number;
  createdAt?: string;
};
