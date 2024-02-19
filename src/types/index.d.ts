export interface RouteLinksTypeT {
  path: string;
  name: string;
  component: string;
  display: boolean;
}

export type inOutReType = {
  group_month: string;
  total_in: number;
  total_out: number;
}[];

export type Res<T> = {
  error?: string;
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
