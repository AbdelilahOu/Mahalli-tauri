<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { RouteLinks } from "@/constants/RouteNames";
import { useRoute } from "vue-router";
import UiIcon from "./ui/UiIcon.vue";
import { computed } from "vue";
import { store } from "@/store";

const { t } = useI18n();
const route = useRoute();
const ActiveLink = computed(() =>
  RouteLinks.find((link) => link.component === route.name)
);
const User = computed(() => store.getters.getUser());
</script>

<template>
  <header
    class="w-full h-full print:hidden sticky top-0 mb-2 z-50 overflow-hidden bg-slate-100"
  >
    <div
      class="w-full h-full flex items-center py-3 px-2 bg-white justify-between"
    >
      <div class="text-black flex items-center justify-center gap-2">
        <span
          @click="$router.back()"
          class="flex items-center justify-center cursor-pointer fill-gray-700 hover:fill-gray-800 transform-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
            <path
              d="m11.1 19.1-6.45-6.475q-.15-.125-.212-.288-.063-.162-.063-.337 0-.175.063-.338.062-.162.212-.287L11.1 4.9q.225-.2.525-.213.3-.012.525.213.225.225.237.525.013.3-.212.55l-5.3 5.275H18.5q.3 0 .525.212.225.213.225.538 0 .325-.225.537-.225.213-.525.213H6.875l5.3 5.3q.2.2.212.512.013.313-.212.538-.225.225-.537.225-.313 0-.538-.225Z"
            />
          </svg>
        </span>
        <span
          @click="$router.forward()"
          class="flex rotate-180 items-center justify-center cursor-pointer fill-gray-700 hover:fill-gray-800 transform-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
            <path
              d="m11.1 19.1-6.45-6.475q-.15-.125-.212-.288-.063-.162-.063-.337 0-.175.063-.338.062-.162.212-.287L11.1 4.9q.225-.2.525-.213.3-.012.525.213.225.225.237.525.013.3-.212.55l-5.3 5.275H18.5q.3 0 .525.212.225.213.225.538 0 .325-.225.537-.225.213-.525.213H6.875l5.3 5.3q.2.2.212.512.013.313-.212.538-.225.225-.537.225-.313 0-.538-.225Z"
            />
          </svg>
        </span>
        <span class="pb-[3px] text-gray-700 flex items-center">
          <button @click="$router.push('/Home')">
            <span class="w-full h-full cursor-pointer bg-white">
              <UiIcon IsStyled="true" class="text-gray-700" name="Home" />
            </span>
          </button>
          <span v-if="route.fullPath !== '/'" class="flex items-center">
            <span class="flex items-center">
              {{ ActiveLink && " / " }}
              {{ ActiveLink && t(`g.r.${ActiveLink.name}`) }}
              {{ route.params.id ? `/ n° ${route.params.id}` : "" }}
            </span>
          </span>
        </span>
      </div>
      <div v-if="User" class="flex items-center gap-2">
        <img class="rounded-full w-8 h-8" :src="User.photoURL" alt="" />
        <span class="font-semibold">{{ User.displayName }}</span>
      </div>
    </div>
  </header>
</template>
