<script setup lang="ts">
import { useI18n } from "vue-i18n";
import UiPagination from "./ui/UiPagination.vue";
import type { InventoryT } from "@/schemas/inventory.schema";
import { cn } from "@/utils/shadcn";
import { Badge } from "./ui/badge";

const { t, d } = useI18n();

defineProps<{
  inventory: InventoryT[];
}>();
</script>

<template>
  <div class="flex flex-col w-full h-fit">
    <table class="table-auto w-full">
      <thead
        class="text-xs h-9 font-semibold uppercase text-[rgba(25,23,17,0.6)] bg-gray-300"
      >
        <tr>
          <th
            v-for="index in [1, 2, 3, 4, 6, 7]"
            :key="index"
            class="p-2 first:rounded-l-[4px] last:rounded-r-[4px]"
          >
            <div class="font-semibold text-left">
              {{ t(`im.i.feilds[${index}]`) }}
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="text-sm divide-y divide-gray-100">
        <tr v-fade="index" v-for="(mvm, index) in inventory" :key="mvm.id">
          <td class="p-2">
            <div class="text-left font-medium">{{ mvm?.name }}</div>
          </td>
          <td class="p-2">
            <div class="text-left">{{ mvm?.price?.toFixed(2) }} DH</div>
          </td>
          <td class="p-2">
            <div class="text-left">{{ mvm.quantity }}</div>
          </td>
          <td class="p-2">
            <div class="text-left">
              {{ d(new Date(mvm.createdAt), "long") }}
            </div>
          </td>
          <td class="p-2">
            <div
              class="flex justify-start gap-3 uppercase font-bold text-xl h-8 p-1"
            >
              <Badge
                variant="outline"
                :class="
                  cn(
                    mvm?.mvmType == 'IN'
                      ? 'bg-green-100 border-green-500 text-green-900'
                      : 'bg-sky-100 border-sky-500 text-sky-900',
                  )
                "
              >
                {{ mvm?.mvmType == "IN" ? "bought" : "sold" }}
              </Badge>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <UiPagination />
    </div>
  </div>
</template>
