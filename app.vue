<script setup lang="ts">
import { attachConsole } from "tauri-plugin-log-api";

const { locale } = useI18n();
useSeoMeta({
  title: "Mahalli",
  description: "Inventory and invoicing management app",
  ogTitle: "Mahalli",
  ogDescription: "Inventory and Invoicing",
  twitterTitle: "Mahalli",
  twitterDescription: "Inventory and Invoicing",
  twitterCard: "summary",
});

useHead({
  htmlAttrs: {
    lang: locale,
    dir: computed(() => (locale.value === "ar" ? "rtl" : "ltr")),
  },
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "/favicon.png",
    },
  ],
});

await attachConsole();
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout name="default">
    <NuxtPage />
  </NuxtLayout>
</template>
