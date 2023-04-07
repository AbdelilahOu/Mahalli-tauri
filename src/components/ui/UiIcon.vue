<!-- npm i vite-svg-loader -->
<script setup lang="ts">
import { defineAsyncComponent } from "vue";
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  IsStyled: {
    type: Boolean,
    default: false,
  },
  Class: {
    type: String,
  },
});
const icon = defineAsyncComponent({
  loader: () => import(`../../assets/svg/${props.name}.svg`),
});
</script>

<template>
  <component
    v-fade="0"
    :class="[
      Class ?? 'w-8 h-8 minh-[2rem] max-h-8 p-1',
      IsStyled && 'cursor-pointer rounded-md hover:bg-gray-100',
    ]"
    :is="icon"
  />
</template>
