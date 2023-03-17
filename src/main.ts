import { MotionPlugin, useMotion } from "@vueuse/motion";
import { createPinia } from "pinia";
import i18n from "./plugins/i18n";
import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import "./assets/main.css";

createApp(App)
  .directive("fade", {
    mounted: (el: HTMLElement, bin) => {
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
  .directive("slide", {
    mounted: (el: HTMLElement, bin) => {
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
    // beforeUpdate: () => "",
  })
  .use(createPinia())
  .use(router)
  .use(i18n)
  .use(MotionPlugin, {
    directves: {},
  })
  .mount("#app");
