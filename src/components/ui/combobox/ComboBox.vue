<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Check, ChevronsUpDown } from "lucide-vue-next";
import { cn, useEmitAsProps } from "@/utils/shadcn";
import { Button } from "../button";
import { ref } from "vue";
import { CommandGroup, CommandItem, Command } from "../command";

defineProps<{
  items: { value: string; label: string }[];
  modelValue: any;
  label: string;
}>();

const emits = defineEmits<{
  "update:modelValue": [value: string | Array<string> | object | Array<object>];
}>();

const emitsAsProps = useEmitAsProps(emits);

const open = ref(false);
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        :variant="modelValue?.value ? 'secondary' : 'outline'"
        role="combobox"
        :aria-expanded="open"
        class="w-full justify-between"
      >
        {{
          modelValue
            ? items.find((item) => item.value === modelValue)?.label
            : label
        }}

        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-full p-0">
      <Command v-bind:="{ modelValue, ...emitsAsProps }">
        <!-- <CommandInput placeholder="Search" />
        <CommandEmpty>No item found.</CommandEmpty> -->
        <CommandGroup>
          <CommandItem
            v-for="item in items"
            :key="item.value"
            :value="String(item.value)"
            @select="open = false"
          >
            <Check
              :class="
                cn(
                  'mr-2 h-4 w-4',
                  modelValue === item.value ? 'opacity-100' : 'opacity-0',
                )
              "
            />
            {{ item.label }}
          </CommandItem>
        </CommandGroup>
      </Command>
    </PopoverContent>
  </Popover>
</template>
