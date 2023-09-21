<script setup lang="ts">
import { convertFileSrc } from "@tauri-apps/api/tauri";
import UiIcon from "@/components/ui/UiIcon.vue";

defineProps<{
  title: string;
  item: Record<any, any>;
}>();
</script>

<template>
  <div
    class="w-full flex xl:sticky shadow-sm xl:top-[54px] z-20 pb-1 rounded-[4px] gap-2 flex-col"
  >
    <div class="text-2xl font-sans py-1 flex items-center font-medium">
      <img
        v-if="item?.image"
        class="rounded-full w-20 h-20 m-2 object-fill"
        :src="convertFileSrc(item.image)"
      />
      <span
        v-else
        class="rounded-full w-20 h-20 m-2 object-fill animate-pulse bg-slate-300 duration-150"
      ></span>
      <h1 class="flex whitespace-nowrap overflow-ellipsis">
        <span class="h-full flex items-center justify-center pt-1">
          <UiIcon name="tag" />
        </span>
        <span class="flex whitespace-nowrap">
          {{ item?.id }} - {{ item?.name ?? item?.fullname }}
        </span>
      </h1>
    </div>
    <div class="w-full h-fit px-2">
      <div class="w-full flex justify-between border-b-2 pb-1 border-gray-500">
        <h1 class="text-xl px-1 font-semibold font-sans">{{ title }}</h1>
        <span @click="$emit('updateItem')">
          <UiIcon name="edit_2" />
        </span>
      </div>
    </div>
    <div class="w-full h-full px-2">
      <div class="flex fill-gray-700 gap-2 items-center">
        <UiIcon name="email" />
        <span class="">{{ item?.email }}</span>
      </div>
      <div class="flex fill-gray-700 gap-2 items-center">
        <UiIcon name="phone" />
        <span class="">{{ item?.phone }}</span>
      </div>
      <div class="flex fill-gray-700 gap-2 items-center">
        <UiIcon name="location" />
        <span class="">{{ item?.address }}</span>
      </div>
    </div>
  </div>
</template>
