import { z } from "zod";

export const CreateQuoteSchema = z.object({
  id: z.string().optional(),
  clientId: z.string().optional(),
});

export type QuoteT = z.infer<typeof CreateQuoteSchema> & {
  fullName?: string;
  products?: number;
  total?: number;
  createdAt?: string;
  identifier: string;
};

export interface QuoteForUpdateT {
  id: string;
  clientId: string;
  fullName: string;
  createdAt: string;
  items: {
    id?: string;
    name?: string;
    product_id?: string;
    quantity?: number;
    price?: number;
  }[];
}

export interface QuoteForCreateT {
  clientId: string;
  items: {
    product_id?: string;
    quantity?: number;
    price?: number;
  }[];
}

export interface QuoteProductT {
  price: number;
  name: string;
  quantity: number;
}
