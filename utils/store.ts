import { reactive } from "vue";

const DEFAULT_STORE = {
  // related to modals
  name: "",
  show: false,
  row: null,
  // auth,
  user: null,
};

export const store = {
  state: reactive<storeState>(DEFAULT_STORE),
  getters: {
    getModalVisibility: () => store.state.show,
    getModalName: () => store.state.name,
    getUser: () => store.state.user,
  },
  setters: {
    updateStore: function ({ key, value }: Args) {
      //@ts-ignore
      store.state[key] = value;
    },
  },
};

interface args1 {
  key: "show";
  value: boolean;
}

interface args2 {
  key: "name";
  value:
    | "TranslationModal"
    | "ProductUpdate"
    | "ProductDelete"
    | "ProductCreate"
    | "InvoiceCreate"
    | "InvoiceUpdate"
    | "InvoiceDelete"
    | "SupplierCreate"
    | "SupplierDelete"
    | "SupplierUpdate"
    | "ClientDelete"
    | "ClientUpdate"
    | "ClientCreate"
    | "OrderCreate"
    | "OrderDelete"
    | "OrderUpdate"
    | "CsvUploader"
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

export type Args = args1 | args2 | args4 | args5;

export interface storeState
  extends Record<"show", boolean>,
    Record<"name", string>,
    Record<"user", any> {}

export interface locale {
  key: string;
  text: string;
}
