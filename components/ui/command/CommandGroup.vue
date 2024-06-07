<script setup lang="ts">
import type { ComboboxGroupProps } from "radix-vue";
import { ComboboxGroup, ComboboxLabel } from "radix-vue";

const props = defineProps<
  ComboboxGroupProps & {
    heading?: string;
  }
>();
</script>

<template>
  <ComboboxGroup
    v-bind="props"
    :class="
      cn('overflow-hidden p-1 text-foreground', ($attrs.class as String) ?? '')
    "
  >
    <ComboboxLabel
      v-if="heading"
      class="px-2 py-1.5 text-xs font-medium text-muted-foreground"
    >
      {{ heading }}
    </ComboboxLabel>
    <slot />
  </ComboboxGroup>
</template>
