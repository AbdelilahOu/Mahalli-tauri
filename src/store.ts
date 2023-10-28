import type { storeState, Args, locale } from "@/types";
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
    getSelectedRow: <T>() => store.state.row as T,
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
