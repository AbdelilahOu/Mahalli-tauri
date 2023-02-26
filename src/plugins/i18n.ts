import messages from "@intlify/unplugin-vue-i18n/messages";
import { createI18n } from "vue-i18n";

const locale = localStorage.getItem("locale");

export default createI18n({
  legacy: false,
  globalInjection: false,
  locale: locale ? JSON.parse(locale).key : "fr",
  fallbackLocale: "fr",
  availableLocales: ["en", "fr", "ar", "de"],
  messages: messages,
});
