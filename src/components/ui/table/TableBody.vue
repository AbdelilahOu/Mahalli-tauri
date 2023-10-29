<script setup lang="ts">
import { cn } from '@/utils/shadcn'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <tbody :class="cn('[&_tr:last-child]:border-0', props.class)">
    <slot />
  </tbody>
</template>
