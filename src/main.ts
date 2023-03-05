import { createPinia } from "pinia";
import i18n from "./plugins/i18n";
import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import "./assets/main.css";

createApp(App).use(createPinia()).use(i18n).use(router).mount("#app");
