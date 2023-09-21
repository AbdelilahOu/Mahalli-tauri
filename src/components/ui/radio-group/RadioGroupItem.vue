<script setup lang="ts">
import {
  RadioGroupIndicator,
  RadioGroupItem,
  type RadioGroupItemProps,
} from "radix-vue";
import { cn } from "@/lib/utils";

const props = defineProps<RadioGroupItemProps & { class?: string }>();
</script>

<template>
  <RadioGroupItem
    v-bind="props"
    :class="
      cn(
        'aspect-square h-4 w-4 rounded-full cursor-pointer flex justify-center items-center border border-primary disabled:cursor-not-allowed disabled:opacity-50',
        props.class
      )
    "
  >
    <RadioGroupIndicator
      :class="cn('flex items-center justify-center', props.class)"
    >
      <svg
        class="w-2.5 h-2.5 text-foreground"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10Z"
        />
      </svg>
    </RadioGroupIndicator>
  </RadioGroupItem>
</template>
