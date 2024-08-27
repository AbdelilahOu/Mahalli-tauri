import { z } from "zod";

export const CreateOrderSchema = z.object({
  id: z.string().optional(),
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
  clientId: z.string().optional(),
});

export type OrderT = z.infer<typeof CreateOrderSchema> & {
  fullName?: string;
  products?: number;
  total?: number;
  createdAt?: string;
  identifier: string;
};

export interface OrderForUpdateT {
  id: string;
  clientId: string;
  fullName: string;
  createdAt: string;
  identifier?: string;
  status: string;
  items: {
    id?: string;
    inventory_id?: string;
    name?: string;
    product_id?: string;
    quantity?: number;
    price?: number;
  }[];
}

export interface OrderForCreateT {
  clientId: string;
  status: string;
  items: {
    product_id?: string;
    quantity?: number;
    price?: number;
  }[];
}

export interface OrderProductT {
  price: number;
  name: string;
  quantity: number;
}
