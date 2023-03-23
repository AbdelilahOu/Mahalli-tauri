<!-- npm i vite-svg-loader -->
<script setup lang="ts">
import { defineAsyncComponent, ref, watch, type Component } from "vue";
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
    default: "",
  },
});
const icon = ref<Component>(
  defineAsyncComponent({
    loader: () => import(`../../assets/svg/${props.name}.svg`),
  })
);

watch(
  () => props.name,
  (name) => {
    icon.value = defineAsyncComponent({
      loader: () => import(`../../assets/svg/${name}.svg`),
    });
  }
);
</script>

<template>
  <component
    v-fade="0"
    :class="[
      Class ? Class : 'w-8 h-8 minh-[2rem] max-h-8 p-1',
      IsStyled && 'cursor-pointer rounded-md hover:bg-gray-100',
    ]"
    :is="icon"
  />
</template>
