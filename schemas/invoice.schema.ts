import { z } from "zod";

export const CreateInvoiceSchema = z.object({
  id: z.string().optional(),
  status: z.enum([
    "DRAFT",
    "SENT",
    "PAID",
    "PARTIALLY_PAID",
    "OVERDUE",
    "CANCELLED",
  ]),
  paidAmount: z.number(),
  clientId: z.string().optional(),
  orderId: z.string().optional(),
});

export type InvoiceT = z.infer<typeof CreateInvoiceSchema> & {
  fullName?: string;
  products?: number;
  total?: number;
  createdAt?: string;
  identifier: string;
};

export interface InvoiceForUpdateT {
  id: string;
  clientId: string;
  fullName: string;
  paidAmount: number;
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
}

export interface InvoiceForCreateT {
  clientId: string;
  status: string;
  paidAmount: number;
  items: {
    product_id?: string;
    quantity?: number;
    price?: number;
  }[];
}

export interface InvoiceProductT {
  price: number;
  name: string;
  quantity: number;
}
