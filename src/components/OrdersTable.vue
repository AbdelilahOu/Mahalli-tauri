<script setup lang="ts">
import { useI18n } from "vue-i18n";
import UiPagination from "./ui/UiPagination.vue";
import { Checkbox } from "./ui/checkbox";
import { RouterLink } from "vue-router";
import UiIcon from "./ui/UiIcon.vue";
import { store } from "@/store";
import { ref } from "vue";
import type { OrderT } from "@/schemas/order.schema";
import { Badge } from "./ui/badge";
import { cn } from "@/utils/shadcn";

defineProps<{ orders: OrderT[] }>();

const { t, d } = useI18n();
const checkedOrders = ref<string[]>([]);

const checkThisOrders = (IsIncluded: boolean, id: string) => {
  IsIncluded
    ? checkedOrders.value.push(id)
    : checkedOrders.value.splice(checkedOrders.value.indexOf(id), 1);
};

const toggleThisOrders = (Order: OrderT, name: string) => {
  store.setters.updateStore({ key: "row", value: Order });
  store.setters.updateStore({ key: "name", value: name });
  store.setters.updateStore({ key: "show", value: true });
};
</script>

<template>
  <div class="flex flex-col w-full h-full gap-10">
    <table class="table-auto w-full">
      <thead
        class="text-xs h-9 font-semibold uppercase text-[rgba(25,23,17,0.6)] bg-gray-300"
      >
        <tr>
          <th class="rounded-l-[4px]"></th>
          <th
            v-for="index in [1, 2, 3, 4, 5]"
            class="p-2 w-fit last:rounded-r-[4px]"
          >
            <div class="font-semibold text-left">
              {{ t(`o.i.feilds[${index}]`) }}
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="text-sm divide-y divide-gray-100">
        <tr v-for="(order, index) in orders" v-fade="index" :key="order.id">
          <td class="p-2">
            <span class="h-full w-full grid">
              <Checkbox />
            </span>
          </td>

          <td class="p-2">
            <div class="text-left whitespace-nowrap overflow-ellipsis">
              <RouterLink
                :to="{
                  name: 'SupplierDetails',
                  params: { id: order.supplierId },
                }"
              >
                {{ order.fullname }}
              </RouterLink>
            </div>
          </td>
          <td class="p-2">
            <div class="text-left whitespace-nowrap overflow-ellipsis">
              <span>
                {{ t("g.plrz.p", { n: order.products }) }}
              </span>
            </div>
          </td>
          <td class="p-2">
            <div
              class="text-left font-medium uppercase whitespace-nowrap overflow-ellipsis"
            >
              <Badge
                variant="outline"
                :class="
                  cn(
                    order?.status == 'CANCELED'
                      ? 'bg-red-100 border-red-500 text-red-900'
                      : order?.status == 'PENDING'
                        ? 'bg-yellow-100 border-yellow-500 text-yellow-900'
                        : order?.status == 'DELIVERED'
                          ? 'bg-green-100 border-green-500 text-green-900'
                          : '',
                  )
                "
              >
                {{ t(`o.s.${order.status.toLowerCase()}`) }}
              </Badge>
            </div>
          </td>
          <td class="p-2">
            <div class="text-left whitespace-nowrap overflow-ellipsis">
              <span v-if="!order.createdAt" class="text-red-400">No date</span>
              <span v-else>
                {{ d(new Date(order.createdAt), "long") }}
              </span>
            </div>
          </td>
          <td class="p-2">
            <div class="flex justify-start gap-3">
              <span @click="toggleThisOrders(order, 'OrderDelete')">
                <UiIcon isStyled name="delete" />
              </span>
              <span @click="toggleThisOrders(order, 'OrderUpdate')">
                <UiIcon isStyled name="edit" />
              </span>
              <RouterLink
                :to="{
                  name: 'OrdersDetails',
                  params: { id: order.id },
                }"
              >
                <UiIcon name="print" />
              </RouterLink>
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
