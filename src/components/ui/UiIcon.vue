<!-- npm i vite-svg-loader -->
<script setup lang="ts">
import { computed, defineAsyncComponent, getCurrentInstance, watch } from "vue";
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
const icon = defineAsyncComponent(
  () => import(`../../assets/svg/${computed(() => props.name).value}.svg`)
);

watch(
  () => props.name,
  () => {
    const currentInstance = getCurrentInstance();
    currentInstance?.proxy?.$forceUpdate();
    console.log(true, currentInstance);
  }
);
</script>

<template>
  <component
    :class="[
      Class ? Class : 'w-8 h-8 p-1',
      IsStyled && 'cursor-pointer rounded-md hover:bg-gray-100',
    ]"
    :is="icon"
  />
</template>
