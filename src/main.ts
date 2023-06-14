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
import "vue3-lottie/dist/style.css";
import { VueFire, VueFireAuth } from "vuefire";
import { FireApp } from "./utils/firebase";

const locale = localStorage.getItem("locale");

const initiVueApp = async () => {
  // sqlite connection
  const db = await database.load("sqlite:db.sqlite");
  // pinia store
  const pinia = createPinia();
  // pinia store plugin for database
  pinia.use(({ store }) => {
    store.db = db;
  });

  // create app
  createApp(App)
    .use(VueFire, {
      firebaseApp: FireApp,
      modules: [VueFireAuth()],
    })
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
};

initiVueApp().then(() => console.log("app mounted"));

declare module "pinia" {
  export interface PiniaCustomProperties {
    db: Database;
  }
}
