<script setup lang="ts">
import { Check, ChevronsUpDown } from "lucide-vue-next";

import { ref } from "vue";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

defineProps<{ value: string; label: string }[]>();

const open = ref(false);
const value = ref({});
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="w-[200px] justify-between"
      >
        {{
          value
            ? items.find((item) => item.value === value)?.label
            : "Select item..."
        }}

        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[200px] p-0">
      <Command v-model="value">
        <CommandInput placeholder="Search item..." />
        <CommandEmpty>No item found.</CommandEmpty>
        <CommandGroup>
          <CommandItem
            v-for="item in items"
            :key="item.value"
            :value="item"
            @select="open = false"
          >
            <Check
              :class="
                cn(
                  'mr-2 h-4 w-4',
                  value === item.value ? 'opacity-100' : 'opacity-0'
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
