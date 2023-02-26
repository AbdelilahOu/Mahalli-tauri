//////////////////////////////////////
/////////////// PINIA STORE STATES///
////////////////////////////////////
export interface toastState {
  ToastQueue: { text: string; id: number }[];
}

export interface modalsState {
  theModal: { [key: string]: any; show: boolean; name: string };
  product: productT | null;
  client: clientT | null;
  command: commandT | null;
  seller: sellerT | null;
  invoice: invoiceT | null;
  credi: crediT | null;
}

export interface productState {
  products: productT[];
}

export interface commandState {
  commands: commandT[];
  command: commandDetailsT | null;
}

export interface invoiceState {
  invoices: invoiceT[];
  invoice: invoiceDetailsT | null;
}

export interface clientState {
  clients: clientT[];
  client: clientT | null;
}

export interface sellerState {
  sellers: sellerT[];
  seller: sellerT | null;
}

export interface stockState {
  stockMouvements: stockMvmT[];
}
///////////////////////////////////
//////////// INTERFACES //////////
/////////////////////////////////
//////////// COMMAND INTERFACES//
export interface commandT {
  // [key: string]: any;
  id: number;
  created_at: string;
  status: string;
  seller_id: number;
  commandItems: commandItemT[];
}

export interface commandItemT {
  id: number;
  product_id: number;
  command_id: number;
  price: number;
  quantity: number;
  stock_id: number;
}

export interface newCommandT extends Partial<Omit<commandT, "commandItems">> {
  commandItems: Omit<commandItemT, "id" | "command_id" | "stock_id">[];
}

export interface updateCommandT
  extends Partial<Omit<commandT, "commmandItems">> {
  commandItems: Partial<commandItemT>[];
}

export interface newCommandItemT
  extends Pick<commandItemT, "product_id" | "quantity" | "price"> {}

export interface commandDetailsItemsT extends commandItemT {
  product: {
    name: string;
    price: number;
    type: string;
    description?: string;
  };
}

export interface commandDetailsT extends Omit<commandT, "commandItems"> {
  commandItems: commandDetailsItemsT[];
  seller: sellerT;
}
// /////////////////////////////////
///////////// INVOICE INTERFACES ///
///////////////////////////////////

export type invoiceT = {
  id: number;
  total: number;
  created_at: string;
  client_id: number;
  invoiceItems: invoiceItemT[];
};

export type invoiceItemT = {
  id: number;
  product_id: number;
  invoice_id: number;
  quantity: number;
  stock_id: number;
  product: {
    price: number;
  };
};

export interface updateInvoiceT
  extends Partial<Omit<invoiceT, "invoiceItems">> {
  invoiceItems: Partial<invoiceItemT>[];
}

export interface newInvoiceT
  extends Omit<invoiceT, "id" | "created_at" | "total"> {
  invoiceItems: newInvoiceItemT[];
}

export interface newInvoiceItemT
  extends Omit<invoiceItemT, "id" | "invoice_id" | "stock_id" | "product"> {}

export interface invoiceDetailsItemT extends invoiceItemT {
  product: {
    price: number;
    name: string;
    tva: number;
  };
}

export interface invoiceDetailsT extends Omit<invoiceT, "invoiceItems"> {
  invoiceItems: invoiceDetailsItemT[];
  client: clientT;
}
////////////////////////////////////
//////////// CLIENT INTERFACES//////
////////////////////////////////////
export interface clientT {
  id: number;
  name: string;
  phone?: string;
  addresse?: string;
  email?: string;
}

export interface newClientT extends Omit<clientT, "id"> {}
export interface updateClientT extends Partial<clientT> {
  [key: string]: any;
}
/////////////////////////////////////////////////
//////////////////// seller INTERFACES //////////
////////////////////////////////////////////////
export interface sellerT extends clientT {}
export interface newSellerT extends newClientT {}
export interface updateSellerT extends updateClientT {}
////////////////////////////////////////////////////
//////////////// STOCKMOUVMENTS INTERFACES /////////
///////////////////////////////////////////////////
export interface stockMvmT {
  id: number;
  date: string;
  model: string;
  quantity: number;
  product_id: number;
  product?: Pick<productT, "price" | "name">;
  commandItem?: Pick<commandItemT, "quantity" | "command_id">;
  invoiceItem?: Pick<invoiceItemT, "quantity" | "invoice_id">;
}
export interface stockT
  extends Omit<stockMvmT, "product" | "commandItem" | "invoiceItem"> {}
export interface newStockMvmT
  extends Pick<stockMvmT, "productId" | "quantity" | "model"> {}

/////////////////////////////////////////////////
/////////////// PRODUCT INTERFACES //////////////
/////////////////////////////////////////////////
export interface productT {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  tva: number;
  type: string;
}
export interface newProductT extends Omit<productT, "id"> {}
export interface productTfromApiT extends Omit<productT, "stock"> {
  stockMouvements: { quantity: number }[];
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

export interface newCrediT
  extends Omit<crediT, "id" | "createdAt" | "client"> {}

///////////////// OTHERS //////////

export interface FilteredStockData {
  [key: string]: { IN: number; OUT: number };
}

export interface editModalArgsT {
  key: string;
  value: string | boolean;
}

export interface RouteLinksTypeT {
  path: string;
  name: string;
  component: string;
  icon: string;
  display: boolean;
}
