import { fade, slide } from "./utils/directivesEffect";
import messages from "@intlify/unplugin-vue-i18n/messages";
import { createI18n } from "vue-i18n";
import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import pinia from "./pinia";
import "./assets/main.css";
import database from "tauri-plugin-sql-api";
import type Database from "tauri-plugin-sql-api";

const locale = localStorage.getItem("locale");

(async () => {
  const db = await database.load("sqlite:db.sqlite");
  createApp(App)
    .directive("slide", { mounted: slide })
    .directive("fade", { mounted: fade })
    .directive("drop", {
      mounted: (el: HTMLElement, bin) => {
        el.addEventListener("dragstart", (e: DragEventInit) => {});
      },
    })
    .use(
      pinia.use(({ store }) => {
        store.db = db;
      })
    )
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
