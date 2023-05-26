import messages from "@intlify/unplugin-vue-i18n/messages";
import { createApp, type DirectiveBinding } from "vue";
import type Database from "tauri-plugin-sql-api";
import database from "tauri-plugin-sql-api";
import { useMotion } from "@vueuse/motion";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import "./assets/main.css";

const locale = localStorage.getItem("locale");

(async () => {
  const db = await database.load("sqlite:db.sqlite");

  const pinia = createPinia();

  pinia.use(({ store }) => {
    store.db = db;
  });

  createApp(App)
    .directive("slide", {
      mounted: (el: HTMLElement, bin: DirectiveBinding) => {
        useMotion(el, {
          initial: {
            opacity: 0,
            x: 20,
          },
          enter: {
            opacity: 1,
            x: 0,
            transition: {
              delay: (bin.value + 1) * 100,
            },
          },
        });
      },
    })
    .directive("fade", {
      mounted: (el: HTMLElement, bin: DirectiveBinding) => {
        useMotion(el, {
          initial: {
            opacity: 0,
          },
          enter: {
            opacity: 1,
            transition: {
              delay: (bin.value + 1) * 100,
            },
          },
        });
      },
    })
    .directive("drop", {
      mounted: (el: HTMLElement, bin) => {
        el.addEventListener("dragstart", (e: DragEventInit) => {});
      },
    })
    .use(pinia)
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
})();

declare module "pinia" {
  export interface PiniaCustomProperties {
    db: Database;
  }
}
