<script setup lang="ts">
import type { ComboboxSeparatorProps } from "radix-vue";
import { ComboboxSeparator } from "radix-vue";
import { cn } from "@/utils/shadcn";

const props = defineProps<ComboboxSeparatorProps>();
</script>

<template>
  <ComboboxSeparator
    v-bind="props"
    :class="cn('-mx-1 h-px bg-border', ($attrs.class as String) ?? '')"
  >
    <slot />
  </ComboboxSeparator>
</template>
