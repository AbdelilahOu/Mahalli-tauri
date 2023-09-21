<script setup lang="ts">
import { computed, inject, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const page = computed(() => Number(router.currentRoute.value.query.page));

const rowsCount = inject<Ref<number>>("count");

const goBack = () => {
  if (page.value > 1) {
    router.push({
      path: route.path,
      query: { page: page.value - 1 },
    });
  }
};

const goForward = () => {
  if (page.value < Math.ceil((rowsCount?.value ?? 1) / 17)) {
    router.push({
      path: route.path,
      query: { page: page.value + 1 },
    });
  }
};
</script>

<template>
  <div class="h-8 w-full mt-2 flex items-center justify-center">
    <div
      class="h-fit w-fit flex items-center text-lg bg-slate-200 px-4 rounded-[4px] font-semibold text-gray-800 gap-4"
    >
      <span
        class="rounded-full flex items-center justify-center cursor-pointer"
        @click="goBack"
      >
        -
      </span>
      <div class="flex w-full h-full items-center">
        <span class="px-1 text-base text-gray-400">
          {{ page > 1 ? page - 1 : page == 1 ? "" : page }}
        </span>
        <span class="px-1">{{ page }}</span>
        <span class="px-1 text-base text-gray-400">
          {{ page === Math.ceil((rowsCount ?? 1) / 17) ? "" : page + 1 }}
        </span>
      </div>
      <span
        @click="goForward()"
        class="rounded-full flex items-center justify-center cursor-pointer"
      >
        +
      </span>
    </div>
  </div>
</template>