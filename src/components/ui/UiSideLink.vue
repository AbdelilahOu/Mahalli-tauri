<script setup lang="ts">
import UiIcon from "./UiIcon.vue";

defineProps<{
  isText: boolean;
  linkText: string;
  icon: string;
}>();
</script>

<template>
  <span
    :class="[
      'w-full flex h-9 rounded-[4px] items-center py-1 px-2 hover:bg-white group transition-all duration-300',
      isText ? 'justify-start' : 'justify-center',
    ]"
  >
    <UiIcon
      :isStyled="false"
      extraStyle="min-w-[30px] h-[30px] w-[30px] max-w-[30px] group-hover:text-primary transition-all duration-150 text-gray-400"
      :name="icon"
    />
    <span
      v-if="isText"
      class="text-gray-500 ml-1 whitespace-nowrap group-hover:text-primary"
    >
      {{ linkText }}
    </span>
    <span v-else class="w-full"></span>
  </span>
</template>
