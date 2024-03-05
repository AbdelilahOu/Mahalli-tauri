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
          <th class="rounded-l-[4px] p-2 w-fit font-semibold text-left">
            {{ t("g.fields.name") }}
          </th>
          <th class="p-2 w-fit font-semibold text-left">
            {{ t("g.fields.price") }}
          </th>
          <th class="p-2 w-fit font-semibold text-left">
            {{ t("g.fields.quantity") }}
          </th>
          <th class="p-2 w-fit font-semibold text-left">
            {{ t("g.fields.status") }}
          </th>
          <th class="rounded-r-[4px] p-2 w-fit font-semibold text-left">
            {{ t("g.fields.date") }}
          </th>
        </tr>
      </thead>
      <tbody class="text-sm divide-y divide-gray-100">
        <tr v-fade="index" v-for="(mvm, index) in inventory" :key="mvm.id">
          <td class="p-2">
            {{ mvm?.name }}
          </td>
          <td class="p-2">{{ mvm?.price?.toFixed(2) }} DH</td>
          <td class="p-2">
            {{ t("g.plrz.i", { n: mvm.quantity }) }}
          </td>
          <td class="p-2">
            <Badge
              variant="outline"
              :class="
                cn(
                  mvm?.mvmType == 'OUT'
                    ? 'bg-green-100 border-green-500 text-green-900'
                    : 'bg-sky-100 border-sky-500 text-sky-900',
                )
              "
            >
              {{ t("g.status." + mvm?.mvmType.toLowerCase()) }}
            </Badge>
          </td>
          <td class="p-2">
            {{ d(new Date(mvm.createdAt), "long") }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pt-12">
      <UiPagination />
    </div>
  </div>
</template>
