<script setup lang="ts">
import {
  PaginationPrev,
  type PaginationPrevProps,
  useForwardProps,
} from "radix-vue";
import { ChevronLeft } from "lucide-vue-next";

const props = withDefaults(defineProps<PaginationPrevProps>(), {
  asChild: true,
});
const forwarded = useForwardProps(props);
</script>

<template>
  <PaginationPrev v-bind="forwarded">
    <Button class="w-10 h-10 p-0" variant="outline">
      <slot>
        <ChevronLeft class="h-4 w-4" />
      </slot>
    </Button>
  </PaginationPrev>
</template>
