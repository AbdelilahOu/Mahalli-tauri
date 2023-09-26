<script setup lang="ts">
import { buttonVariants } from ".";
import { cn } from "@/utils/shadcn";

interface Props {
  variant?: NonNullable<Parameters<typeof buttonVariants>[0]>["variant"];
  size?: NonNullable<Parameters<typeof buttonVariants>[0]>["size"];
  as?: string;
  onClick?: (args: any) => void;
}

withDefaults(defineProps<Props>(), {
  as: "button",
});
</script>

<template>
  <component
    @click="onClick"
    :is="as"
    :class="cn(buttonVariants({ variant, size }), $attrs.class ?? '')"
  >
    <slot />
  </component>
</template>
