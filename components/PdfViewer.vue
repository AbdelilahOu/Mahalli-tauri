<script setup lang="ts">
defineProps<{
  pdfContent: string;
}>();
</script>

<template>
  <iframe class="flex-1 rounded-md" :src="pdfContent" />
</template>
