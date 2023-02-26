import { defineStore } from "pinia";

const locale = localStorage.getItem("locale");
export const useTranslationStore = defineStore("TranslationStore", {
  state: (): translationState => {
    return {
      currentLocale: locale
        ? JSON.parse(locale)
        : {
            key: "en",
            text: "English",
          },
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
    };
  },
  actions: {
    changeLocale: function (locale: locale) {
      localStorage.setItem("locale", JSON.stringify(locale));
      this.currentLocale = locale;
    },
  },
});

interface locale {
  key: string;
  text: string;
}

interface translationState {
  currentLocale: locale;
  availableLocals: locale[];
}
