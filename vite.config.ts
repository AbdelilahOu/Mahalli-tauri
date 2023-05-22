import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { fileURLToPath, URL } from "node:url";
import vueJsx from "@vitejs/plugin-vue-jsx";
import svgLoader from "vite-svg-loader";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    vueJsx(),
    svgLoader(),
    VueI18nPlugin({
      include: "./src/locales/**",
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
