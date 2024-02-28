import { reactive } from "vue";

const locale = localStorage.getItem("locale");
const currentLocale = locale
  ? JSON.parse(locale)
  : {
      key: "en",
      text: "English",
    };

const DEFAULT_STORE = {
  // related to modals
  name: "",
  show: false,
  row: null,
  // i18n
  currentLocale,
  availableLocals: [
    {
      key: "en-US",
      text: "English",
    },
    {
      key: "fr-FR",
      text: "Francais",
    },
    {
      key: "ar-AE",
      text: "Arabic",
    },
    {
      key: "de-DE",
      text: "German",
    },
  ],
  // auth,
  user: null,
};

export const store = {
  state: reactive<storeState>(DEFAULT_STORE),
  getters: {
    getModalVisibility: () => store.state.show,
    getModalName: () => store.state.name,
    getCurrentLocale: () => store.state.currentLocale,
    getLocales: () => store.state.availableLocals,
    getUser: () => store.state.user,
  },
  setters: {
    updateStore: function ({ key, value }: Args) {
      if (key == "currentLocale")
        localStorage.setItem("locale", JSON.stringify(value));

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

export type Args = args1 | args2 | args4 | args5;

export interface storeState
  extends Record<"availableLocals", locale[]>,
    Record<"currentLocale", locale>,
    Record<"show", boolean>,
    Record<"name", string>,
    Record<"user", any> {}

export interface locale {
  key: string;
  text: string;
}
