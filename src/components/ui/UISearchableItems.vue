<script setup lang="ts">
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ref } from "vue";
import { cn } from "@/utils/shadcn";
const open = ref(false);

const props = defineProps<{
  defaultValue?: string;
  items: { label: string; value: string }[];
}>();

const emits = defineEmits<{
  (e: "update:items", s: string | number): () => void;
  (e: "on:select", s: string): () => void;
}>();

const inputValue = ref<string | number>(props.defaultValue ?? "");

let timer: number;
const updateInput = (s: string | number) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    emits("update:items", s);
    open.value = true;
  }, 500);
};

const selectItem = (item: { label: string; value: string }) => {
  inputValue.value = item.label;
  emits("on:select", item.value);
  open.value = false;
};
</script>

<template>
  <Popover :open="open">
    <PopoverTrigger aria-disabled="true">
      <Input
        v-model:model-value="inputValue"
        @update:model-value="updateInput"
        placeHolder="search"
      />
    </PopoverTrigger>
    <PopoverContent @focus-outside="open = false">
      <div
        :class="
          cn(
            'space-y-1',
            items.length > 5
              ? 'max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-transparent'
              : 'h-fit',
          )
        "
      >
        <span
          class="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          v-for="item in items"
          :key="item.value"
          @click="() => selectItem(item)"
        >
          {{ item.label }}
        </span>
      </div>
    </PopoverContent>
  </Popover>
</template>
