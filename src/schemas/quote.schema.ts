import { z } from "zod";

export const CreateQuoteSchema = z.object({
  id: z.string().optional(),
  clientId: z.string().optional(),
});

export type QuoteT = z.infer<typeof CreateQuoteSchema> & {
  fullname?: string;
  products?: number;
  total?: number;
  createdAt?: string;
};

export type QuoteForUpdateT = {
  id: string;
  clientId: string;
  fullname: string;
  createdAt: string;
  items: {
    id?: string;
    inventory_id?: string;
    name?: string;
    product_id?: string;
    quantity?: number;
    price?: number;
  }[];
};

export type QuoteForCreateT = {
  clientId: string;
  items: {
    product_id?: string;
    quantity?: number;
    price?: number;
  }[];
};

export type QuoteProductT = {
  price: number;
  name: string;
  quantity: number;
};
