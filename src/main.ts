import { fade, slide } from "./utils/directivesEffect";
import messages from "@intlify/unplugin-vue-i18n/messages";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";
import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import "./assets/main.css";

const locale = localStorage.getItem("locale");

createApp(App)
  .directive("slide", { mounted: slide })
  .directive("fade", { mounted: fade })
  .directive("aaaaa", {
    mounted: (el: HTMLElement, bin) => {
      el.addEventListener("dragstart", (e: DragEventInit) => {});
    },
  })
  .use(createPinia())
  .use(router)
  .use(
    createI18n({
      legacy: false,
      globalInjection: false,
      locale: locale ? JSON.parse(locale).key : "fr",
      fallbackLocale: "fr",
      availableLocales: ["en", "fr", "ar", "de"],
      messages: messages,
    })
  )
  .mount("#app");
