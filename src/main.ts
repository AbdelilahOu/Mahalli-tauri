import messages from "@intlify/unplugin-vue-i18n/messages";
import { createApp, type DirectiveBinding } from "vue";
import { VueFire, VueFireAuth } from "vuefire";
import { useMotion } from "@vueuse/motion";
import { FireApp } from "./utils/firebase";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";
import "vue3-lottie/dist/style.css";
import router from "./router";
import App from "./App.vue";
import "./assets/main.css";

const locale = localStorage.getItem("locale");

const initiVueApp = async () => {
  // sqlite connection
  const pinia = createPinia();
  // pinia store plugin for database
  pinia.use(({ store }) => {
    store.db = {
      execute: async (query: string, args: any[]) => {
        if (args.length) {
          for (let i = 0; i < args.length; i++) {
            query.replace("$".concat(i.toString()), args[i]);
          }
          console.log(query);
        }
      },
      select: async (query: string, args: any[]) => {
        if (args.length) {
          for (let i = 0; i < args.length; i++) {
            query.replace("$".concat(i.toString()), args[i]);
          }
          console.log(query);
        }
      },
    };
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
    db: {
      execute: (query: string, args: any[]) => Promise<void>;
      select: (query: string, args: any[]) => Promise<void>;
    };
  }
}
