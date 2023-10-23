<script setup lang="ts">
import { useI18n } from "vue-i18n";
import UiPagination from "./ui/UiPagination.vue";
import { formatDate } from "@/utils/formatDate";
import type { inventoryMvmT } from "@/types";
import { RouterLink } from "vue-router";
import UiIcon from "./ui/UiIcon.vue";

const { t } = useI18n();

defineProps<{
  inventory: inventoryMvmT[];
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
            v-for="index in [1, 2, 3, 4, 5, 6, 7]"
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
            <div class="text-left font-medium">{{ mvm.product?.name }}</div>
          </td>
          <td class="p-2">
            <div class="text-left">{{ mvm.product?.price?.toFixed(2) }} DH</div>
          </td>
          <td class="p-2">
            <div class="text-left">
              {{
                mvm.orderItem?.price && mvm.orderItem?.price > 0
                  ? mvm.orderItem?.price?.toFixed(2)
                  : mvm.product?.price?.toFixed(2)
              }}
              DH
            </div>
          </td>
          <td class="p-2">
            <div class="text-left">{{ Math.abs(mvm.quantity) }}</div>
          </td>
          <td class="p-2">
            <div class="text-left font-medium">
              <RouterLink
                v-if="mvm.orderItem?.order_id"
                :to="{
                  name: 'OrdersDetails',
                  params: { id: mvm.orderItem?.order_id },
                }"
              >
                <span
                  class="px-3 py-[1px] h-full flex w-fit items-center justify-center gap-2 rounded-full bg-sky-300/60 text-sky-800"
                >
                  <span>order</span>
                </span>
              </RouterLink>
              <RouterLink
                v-if="mvm.invoiceItem?.invoice_id"
                class="w-full"
                :to="{
                  name: 'InvoiceDetails',
                  params: { id: mvm.invoiceItem?.invoice_id },
                }"
              >
                <span
                  class="px-3 py-[1px] h-full flex w-fit items-center justify-center gap-2 rounded-full bg-sky-300/60 text-sky-800"
                >
                  <span>invoice</span>
                </span>
              </RouterLink>
            </div>
          </td>
          <td class="p-2">
            <div class="text-left">{{ formatDate(mvm.date) }}</div>
          </td>
          <td class="p-2">
            <div class="flex justify-start gap-3 font-bold text-xl h-8 p-1">
              <UiIcon v-if="mvm.model == 'IN'" name="chartUp" />
              <UiIcon v-else name="chartDown" />
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
