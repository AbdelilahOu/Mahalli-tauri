<script setup lang="ts">
import { HomeIcon, ChevronLeft, ChevronRight } from "lucide-vue-next";
const localePath = useLocalePath();
const { locale } = useI18n();
</script>

<template>
  <header class="w-full h-full print:hidden sticky top-0 z-50">
    <div
      class="w-full h-full flex items-center py-3 px-2 bg-white justify-between"
    >
      <div
        :class="{
          'text-black flex items-center justify-center gap-2': true,
          'flex-row-reverse': locale == 'ar',
        }"
      >
        <ChevronLeft
          :size="20"
          class="cursor-pointer"
          @click="$router.back()"
        />
        <ChevronRight
          :size="20"
          class="cursor-pointer"
          @click="$router.forward()"
        />
        <NuxtLink :to="localePath('/')">
          <HomeIcon :size="18" class="bg-white" />
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
