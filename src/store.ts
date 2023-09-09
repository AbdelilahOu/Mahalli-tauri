import type { clientT, invoiceT, orderT, productT, sellerT } from "@/types";
import { reactive } from "vue";

const locale = localStorage.getItem("locale");
const currentLocale = locale
  ? JSON.parse(locale)
  : {
      key: "en",
      text: "English",
    };

export const store = {
  state: reactive<storeState>({
    // related to modals
    show: false,
    row: null,
    name: String(),
    // i18n
    currentLocale,
    availableLocals: [
      {
        key: "fr",
        text: "Francais",
      },
      {
        key: "en",
        text: "English",
      },
      {
        key: "ar",
        text: "Arabic",
      },
      {
        key: "de",
        text: "German",
      },
    ],
    // auth,
    user: {},
  }),
  getters: {
    getModalVisibility: () => store.state.show,
    getSelectedRow: <T>() => store.state.row as T,
    getModalName: () => store.state.name,
    getCurrentLocale: () => store.state.currentLocale,
    getLocales: () => store.state.availableLocals,
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
  value: string;
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

type Args = args1 | args2 | args3 | args4 | args5;

interface storeState
  extends Record<
      "row",
      clientT | productT | sellerT | orderT | invoiceT | null
    >,
    Record<"availableLocals", locale[]>,
    Record<"currentLocale", locale>,
    Record<"show", boolean>,
    Record<"name", string>,
    Record<"user", any> {}

interface locale {
  key: string;
  text: string;
}
