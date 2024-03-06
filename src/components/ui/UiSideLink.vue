<script setup lang="ts">
import UiIcon from "./UiIcon.vue";
import { cn } from "@/utils/shadcn";

defineProps<{
  isText: boolean;
  linkText: string;
  icon: string;
}>();
</script>

<template>
  <span
    :class="
      cn(
        'w-full flex h-9  rounded-md items-center py-1 px-1 hover:bg-white group transition-all duration-300',
        isText ? 'gap-1' : '',
      )
    "
  >
    <UiIcon
      :isStyled="false"
      extraStyle="min-w-[30px] max-w-[30px] group-hover:text-primary transition-all duration-150 text-gray-400"
      :name="icon"
    />
    <span
      v-if="isText"
      class="text-gray-500 whitespace-nowrap text-sm group-hover:text-primary"
    >
      {{ linkText }}
    </span>
    <!-- <span v-else class="w-full"></span> -->
  </span>
</template>
