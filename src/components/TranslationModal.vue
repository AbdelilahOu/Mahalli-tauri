<script setup lang="ts">
import { globalTranslate } from "@/utils/globalTranslate";
import UiIcon from "./ui/UiIcon.vue";
import { Button } from "./ui/button";
import { useI18n } from "vue-i18n";
import { store } from "@/store";
import { computed } from "vue";

const availableLocales = computed(() => store.getters.getLocales());
const i18n = useI18n();

const changeLocale = (locale: { key: string; text: string }) => {
  i18n.locale.value = locale.key;
  store.setters.updateStore({ key: "currentLocale", value: locale });
  store.setters.updateStore({ key: "show", value: false });
};
</script>

<template>
  <div class="w-1/2 h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
    <h1
      class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center"
    >
      {{ globalTranslate("Global.translationTitle") }}
    </h1>
    <div class="grid grid-cols-2 gap-2">
      <Button
        variant="ghost"
        v-for="item in availableLocales"
        :key="item.key"
        @click="changeLocale(item)"
      >
        <span
          class="w-3/5 items-center h-full text-start flex justify-center gap-2"
        >
          <span class="py-2">
            <UiIcon :isStyled="true" :name="item.key" />
          </span>
          {{ item.text }}
        </span>
      </Button>
    </div>
  </div>
</template>
