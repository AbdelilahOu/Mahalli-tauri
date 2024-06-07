<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import ModalLoading from "./ModalLoading.vue";
import Error from "./Error.vue";

const { name } = defineProps<{ name: string }>();

const x = defineAsyncComponent({
  loader: () => import(`../components/${name}.vue`),
  loadingComponent: ModalLoading,
  errorComponent: Error,
});
</script>

<template>
  <component :is="x" />
</template>
