<script lang="ts" setup>
import { useAttrs } from "vue";
import { useFormField } from "./useFormField";
import { cn } from "@/utils/shadcn";

defineOptions({
  inheritAttrs: false,
});

const { formDescriptionId } = useFormField();
const { class: className, ...rest } = useAttrs();
</script>

<template>
  <p
    :id="formDescriptionId"
    :class="cn('text-sm text-muted-foreground', (className as string) ?? '')"
    v-bind="rest"
  >
    <slot />
  </p>
</template>
