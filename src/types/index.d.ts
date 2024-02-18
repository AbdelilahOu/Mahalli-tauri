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
  id: string;
  created_at: string;
  status: string;
  seller_id: string;
  seller: {
    id: string;
    name: string;
  };
  order_items: orderItemT[];
}

export interface orderItemT {
  id: string;
  product_id: string;
  order_id: string;
  price: number;
  quantity: number;
  inventory_id: string;
  product: {
    id: string;
    price: number;
    name: string;
  };
}

export interface newOrdersT extends Partial<Omit<orderT, "order_items">> {
  order_items: Partial<
    Omit<orderItemT, "id" | "order_id" | "inventory_id" | "product">
  >[];
}

export interface updateOrdersT extends Partial<Omit<orderT, "order_items">> {
  order_items: Partial<orderItemT>[];
}

export interface newOrdersItemT
  extends Partial<Pick<orderItemT, "product_id" | "quantity" | "price">> {}

export interface orderDetailsItemsT extends orderItemT {
  product: {
    id: string;
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
  id: string;
  total: number;
  created_at: string;
  status: string;
  client_id: string;
  client: {
    id: string;
    fullname: string;
  };
  invoice_items: invoiceItemT[];
};

export type invoiceItemT = {
  id: string;
  product_id: string;
  invoice_id: string;
  quantity: number;
  inventory_id: string;
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
  extends Partial<
    Omit<invoiceT, "id" | "created_at" | "total" | "client" | "invoice_items">
  > {
  invoice_items: newInvoiceItemT[];
}

export interface newInvoiceItemT
  extends Partial<
    Omit<invoiceItemT, "id" | "invoice_id" | "inventory_id" | "product">
  > {}

export interface invoiceDetailsItemT extends invoiceItemT {
  product: {
    price: number;
    name: string;
    // tva: number;
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
  id: string;
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
  id: string;
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
  product_id: string;
  product: {
    name: string;
    price: number;
  };
}
export interface inventoryT
  extends Omit<inventoryMvmT, "product" | "orderItem" | "invoiceItem"> {}
export interface newInventoryMvmT
  extends Partial<Pick<inventoryMvmT, "product_id" | "quantity" | "model">> {}

/////////////////////////////////////////////////
/////////////// PRODUCT INTERFACES //////////////
/////////////////////////////////////////////////
export interface productT {
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  description?: string;
  stock?: string;
  // tva: number;
}
export interface newProductT extends Partial<Omit<productT, "id">> {}
export interface productTfromApiT extends Omit<productT, "inventory"> {
  inventoryMouvements: { quantity: number }[];
}
export interface updateProductT extends Partial<productT> {}
//////////////////////////////////////////////////
/////////////////////////////////////
export interface crediT {
  clientId: string;
  createdAt: string;
  id: string;
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

export type Res<T> = {
  error?: message;
  message?: string;
  data: T;
};

// :::::::::::::::::::::::::::::::::::::::::::::::::
interface args1 {
  key: "show";
  value: boolean;
}

interface args2 {
  key: "name";
  value:
    | "TranslationModal"
    | "InventoryCreate"
    | "ProductUpdate"
    | "ProductDelete"
    | "ProductCreate"
    | "InvoiceCreate"
    | "InvoiceUpdate"
    | "InvoiceDelete"
    | "SellerCreate"
    | "SellerDelete"
    | "SellerUpdate"
    | "ClientDelete"
    | "ClientUpdate"
    | "ClientCreate"
    | "OrderCreate"
    | "OrderDelete"
    | "OrderUpdate"
    | "CsvUploader"
    | "Sittings"
    | string;
}

interface args4 {
  key: "currentLocale";
  value: locale;
}

interface args5 {
  key: "user";
  value: any;
}

interface args3 {
  key: "row";
  value: clientT | productT | sellerT | orderT | invoiceT | null;
}

export type Args = args1 | args2 | args3 | args4 | args5;

export interface storeState
  extends Record<
      "row",
      clientT | productT | sellerT | orderT | invoiceT | null
    >,
    Record<"availableLocals", locale[]>,
    Record<"currentLocale", locale>,
    Record<"show", boolean>,
    Record<"name", string>,
    Record<"user", any> {}

export interface locale {
  key: string;
  text: string;
}
