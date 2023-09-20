//////////////////////////////////////
/////////////// PINIA STORE STATES///
////////////////////////////////////
export interface modalsState {
  theModal: { [key: string]: any; show: boolean; name: string };
  product: productT | null;
  client: clientT | null;
  order: orderT | null;
  seller: sellerT | null;
  invoice: invoiceT | null;
  credi: crediT | null;
}

///////////////////////////////////
//////////// INTERFACES //////////
/////////////////////////////////
//////////// COMMAND INTERFACES//
export interface orderT {
  // [key: string]: any;
  id: number;
  created_at: string;
  status: string;
  seller_id: number;
  seller: {
    id: number;
    name: string;
  };
  order_items: orderItemT[];
}

export interface orderItemT {
  id: number;
  product_id: number;
  order_id: number;
  price: number;
  quantity: number;
  inventory_id: number;
  product: {
    id: number;
    price: number;
    name: string;
  };
}

export interface newOrdersT extends Partial<Omit<orderT, "order_items">> {
  order_items: Omit<
    orderItemT,
    "id" | "order_id" | "inventory_id" | "product"
  >[];
}

export interface updateOrdersT extends Partial<Omit<orderT, "order_items">> {
  order_items: Partial<orderItemT>[];
}

export interface newOrdersItemT
  extends Pick<orderItemT, "product_id" | "quantity" | "price"> {}

export interface orderDetailsItemsT extends orderItemT {
  product: {
    id: number;
    name: string;
    price: number;
    description?: string;
  };
}

export interface orderDetailsT extends Omit<orderT, "order_items"> {
  order_items: orderDetailsItemsT[];
  seller: sellerT;
}
// /////////////////////////////////
///////////// INVOICE INTERFACES ///
///////////////////////////////////

export type invoiceT = {
  id: number;
  total: number;
  created_at: string;
  status: string;
  client_id: number;
  client: {
    id: number;
    fullname: string;
  };
  invoice_items: invoiceItemT[];
};

export type invoiceItemT = {
  id: number;
  product_id: number;
  invoice_id: number;
  quantity: number;
  inventory_id: number;
  product: {
    price: number;
    name: string;
  };
};

export interface updateInvoiceT
  extends Partial<Omit<invoiceT, "invoice_items">> {
  invoice_items: Partial<invoiceItemT>[];
}

export interface newInvoiceT
  extends Omit<
    invoiceT,
    "id" | "created_at" | "total" | "client" | "invoice_items"
  > {
  invoice_items: newInvoiceItemT[];
}

export interface newInvoiceItemT
  extends Omit<
    invoiceItemT,
    "id" | "invoice_id" | "inventory_id" | "product"
  > {}

export interface invoiceDetailsItemT extends invoiceItemT {
  product: {
    price: number;
    name: string;
    tva: number;
    description: string;
  };
}

export interface invoiceDetailsT extends Omit<invoiceT, "invoice_items"> {
  invoice_items: invoiceDetailsItemT[];
  client: clientT;
}
////////////////////////////////////
//////////// CLIENT INTERFACES//////
////////////////////////////////////
export interface clientT {
  id: number;
  fullname: string;
  phone?: string;
  address?: string;
  email?: string;
  image?: string;
}

export interface newClientT extends Omit<clientT, "id"> {}
export interface updateClientT extends Partial<clientT> {
  [key: string]: any;
}
/////////////////////////////////////////////////
//////////////////// seller INTERFACES //////////
////////////////////////////////////////////////
export interface sellerT extends Omit<clientT, "fullname"> {
  name: string;
}
export interface newSellerT extends Omit<newClientT, "fullname"> {
  name: string;
}
export interface updateSellerT extends Omit<updateClientT, "fullname"> {
  name: string | undefined;
}
////////////////////////////////////////////////////
//////////////// STOCKMOUVMENTS INTERFACES /////////
///////////////////////////////////////////////////
export interface inventoryMvmT {
  id: number;
  date: string;
  model: string;
  quantity: number;
  orderItem?: {
    order_id?: number;
    price?: number;
  };
  invoiceItem?: {
    invoice_id?: number;
  };
  product_id: number;
  product: {
    name: string;
    price: number;
  };
}
export interface inventoryT
  extends Omit<inventoryMvmT, "product" | "orderItem" | "invoiceItem"> {}
export interface newInventoryMvmT
  extends Pick<inventoryMvmT, "productId" | "quantity" | "model"> {}

/////////////////////////////////////////////////
/////////////// PRODUCT INTERFACES //////////////
/////////////////////////////////////////////////
export interface productT {
  id: number;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  description?: string;
  tva: number;
}
export interface newProductT extends Omit<productT, "id"> {}
export interface productTfromApiT extends Omit<productT, "inventory"> {
  inventoryMouvements: { quantity: number }[];
}
export interface updateProductT extends Partial<productT> {}
//////////////////////////////////////////////////
/////////////////////////////////////
export interface crediT {
  clientId: number;
  createdAt: string;
  id: number;
  price: number;
  client: {
    name: string;
  };
}

export interface newPaymentT
  extends Omit<crediT, "id" | "createdAt" | "client"> {}

///////////////// OTHERS //////////

export interface FilteredInventoryData {
  [key: string]: Record<"IN" | "OUT", number>;
}

export interface editModalArgsT {
  key: string;
  value: string | boolean;
}

export interface RouteLinksTypeT {
  path: string;
  name: string;
  component: string;
  display: boolean;
}

export type FileNames = "Image" | "Doc";

export type inOutReType = {
  group_month: string;
  total_in: number;
  total_out: number;
}[];

export type withCount<T> = {
  count: number;
  data: T;
};
