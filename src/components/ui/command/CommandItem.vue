<script setup lang="ts">
import type { ComboboxItemEmits, ComboboxItemProps } from "radix-vue";
import { ComboboxItem } from "radix-vue";
import { cn, useEmitAsProps } from "@/utils/shadcn";

const props = defineProps<ComboboxItemProps>();
const emits = defineEmits<ComboboxItemEmits>();

const emitsAsProps = useEmitAsProps(emits);
</script>

<template>
  <ComboboxItem
    v-bind="{ ...props, ...emitsAsProps }"
    :class="
      cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        ($attrs.class as String) ?? '',
      )
    "
  >
    <slot />
  </ComboboxItem>
</template>
