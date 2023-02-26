import { createPinia } from "pinia";
import { createApp, watch } from "vue";
import i18n from "./plugins/i18n";
import router from "./router";
import App from "./App.vue";
import "./assets/main.css";

createApp(App).use(createPinia()).use(i18n).use(router).mount("#app");
