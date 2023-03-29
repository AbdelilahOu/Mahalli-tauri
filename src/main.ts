import { fade, slide } from "./utils/directivesEffect";
import { createPinia } from "pinia";
import i18n from "./plugins/i18n";
import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import "./assets/main.css";

createApp(App)
  .directive("slide", { mounted: slide })
  .directive("fade", { mounted: fade })
  .use(createPinia())
  .use(router)
  .use(i18n)
  .mount("#app");
