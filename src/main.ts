import { createApp, type DirectiveBinding } from "vue";
// import { VueFire, VueFireAuth } from "vuefire";
import { useMotion } from "@vueuse/motion";
// import { FireApp } from "./utils/firebase";
import router from "./router";
import App from "./App.vue";
import "./assets/main.css";
import { i18n } from "./i18n";

const initiVueApp = () => {
  createApp(App)
    // .use(VueFire, {
    //   firebaseApp: FireApp,
    //   modules: [VueFireAuth()],
    // })
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
    .use(router)
    .use(i18n)
    .mount("#app");
};

initiVueApp();
