import { z } from "zod";

export const CreateOrderSchema = z.object({
  id: z.string().optional(),
  status: z.enum(["CANCELED", "PENDING", "DELIVERED"]),
  clientId: z.string().optional(),
});

export type OrderT = z.infer<typeof CreateOrderSchema> & {
  fullname?: string;
  products?: number;
  total?: number;
  createdAt?: string;
  identifier: string;
};

export type OrderForUpdateT = {
  id: string;
  clientId: string;
  fullname: string;
  createdAt: string;
  status: string;
  items: {
    id?: string;
    inventory_id?: string;
    name?: string;
    product_id?: string;
    quantity?: number;
    price?: number;
  }[];
};

export type OrderForCreateT = {
  clientId: string;
  status: string;
  items: {
    product_id?: string;
    quantity?: number;
    price?: number;
  }[];
};

export type OrderProductT = {
  price: number;
  name: string;
  quantity: number;
};
