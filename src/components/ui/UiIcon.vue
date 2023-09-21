<!-- npm i vite-svg-loader -->
<script setup lang="ts">
import { defineAsyncComponent } from "vue";
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  isStyled: {
    type: Boolean,
    default: false,
  },
  extraStyle: {
    type: String,
  },
});
const icon = defineAsyncComponent({
  loader: () => import(`../../assets/svg/${props.name}.svg`),
});
</script>

<template>
  <component
    :class="[
      extraStyle ?? 'w-8 h-8 minh-[2rem] max-h-8 p-1',
      isStyled && 'cursor-pointer rounded-md hover:bg-gray-100',
    ]"
    :is="icon"
  />
</template>
