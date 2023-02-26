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
});
const icon = defineAsyncComponent(
  () => import(`../../assets/svg/${props.name}.svg`)
);
</script>
<template>
  <component
    :class="[
      'w-8 h-8 p-1',
      IsStyled ? '' : 'cursor-pointer rounded-full hover:bg-gray-100',
    ]"
    :is="icon"
  />
</template>
