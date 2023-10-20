<!-- npm i vite-svg-loader -->
<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { cn } from "@/utils/shadcn";
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
    :class="[cn(extraStyle, 'w-8 h-8 min-h-[2rem] max-h-8 p-1')]"
    :is="icon"
  />
</template>
