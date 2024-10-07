<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  pdfContent: string;
}>();

const pdfRef = ref<HTMLIFrameElement | null>(null);
</script>

<template>
  <iframe ref="pdfRef" class="flex-1" :src="pdfContent" />
</template>
