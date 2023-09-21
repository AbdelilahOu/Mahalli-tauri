<script setup lang="ts">
import { defineModel } from "vue";
import { cn } from "@/lib/utils";

defineProps<{
  type: string;
  placeHolder: string;
}>();

const modelValue = defineModel<string | number>();
</script>

<template>
  <input
    v-model="modelValue"
    :type="type"
    :placeholder="placeHolder"
    :class="
      cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:border-black disabled:cursor-not-allowed disabled:opacity-50 transition-color duration-150',
        $attrs.class ?? ''
      )
    "
  />
</template>
