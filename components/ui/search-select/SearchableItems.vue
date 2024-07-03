<script setup lang="ts">
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { onClickOutside } from "@vueuse/core";

const props = defineProps<{
  defaultValue?: string;
  items: {
    label: string;
    value: string;
    price?: number;
  }[];
}>();

const emits = defineEmits<{
  (e: "update:items", s: string | number): () => void;
  (e: "on:select", s: string, a?: number): () => void;
}>();

const { t } = useI18n();

const open = ref(false);
const dropdownParent = ref<HTMLElement | null>(null);
const inputValue = ref<string | number>(props.defaultValue ?? "");

let timer: any;
const updateInput = (s: string | number) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    emits("update:items", s);
    open.value = true;
  }, 500);
};

onClickOutside(dropdownParent, () => (open.value = false));

const selectItem = (item: { label: string; value: string; price?: number }) => {
  inputValue.value = item.label;
  emits("on:select", item.value, item.price);
  open.value = false;
};
</script>

<template>
  <div ref="dropdownParent">
    <Popover :open="open">
      <PopoverTrigger class="w-full" aria-disabled="true">
        <Input
          v-model:model-value="inputValue"
          :placeholder="t('g.s')"
          @update:model-value="updateInput"
        />
      </PopoverTrigger>
      <PopoverContent class="p-1" @open-auto-focus="(e) => e.preventDefault()">
        <div
          v-if="items.length > 0"
          :class="
            cn(
              'space-y-1',
              items.length > 5
                ? 'max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-transparent'
                : 'h-fit'
            )
          "
        >
          <span
            v-for="item in items"
            :key="item.value"
            class="relative flex w-full hover:bg-slate-100 cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            @click="() => selectItem(item)"
          >
            {{ item.label }}
          </span>
        </div>
        <div v-else>
          <span
            class="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          >
            No elements
          </span>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>
