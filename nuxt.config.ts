// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/i18n",
    "@nuxt/eslint",
  ],
  sourcemap: false,
  ssr: false,
  eslint: {},
  routeRules: {
    "/": {
      prerender: true,
    },
  },
  shadcn: {
    componentDir: "./components/ui",
  },
  i18n: {
    locales: [
      {
        code: "en",
        file: "en-US.json",
      },
      {
        code: "fr",
        file: "fr-FR.json",
      },
      {
        code: "ar",
        file: "ar-AE.json",
      },
      {
        code: "de",
        file: "de-DE.json",
      },
    ],
    langDir: "lang",
    defaultLocale: "en",
    vueI18n: "./i18n.config.ts",
  },
});
