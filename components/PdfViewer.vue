<script setup lang="ts">
import { ref, onMounted } from "vue";

const pdfRef = ref<HTMLIFrameElement | null>(null);

defineProps<{
  pdfContent: string;
}>();
</script>

<template>
  <iframe ref="pdfRef" class="flex-1" :src="pdfContent" />
</template>
