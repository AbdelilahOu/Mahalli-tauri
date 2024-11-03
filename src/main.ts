import { createApp, type DirectiveBinding } from "vue";
import { useMotion } from "@vueuse/motion";
import router from "./router";
import App from "./App.vue";
import "./assets/main.css";
import { i18n } from "./i18n";

const initiVueApp = () => {
  createApp(App)
    .directive("fade", {
      mounted: (el: HTMLElement, bin: DirectiveBinding) => {
        useMotion(el, {
          initial: {
            opacity: 0,
          },
          enter: {
            opacity: 1,
            transition: {
              delay: (bin.value + 1) * 30,
            },
          },
        });
      },
    })
    .use(router)
    .use(i18n)
    .mount("#app");
};

initiVueApp();
