<script setup lang="ts">
import { globalTranslate } from "@/utils/globalTranslate";
import UiPagination from "./ui/UiPagination.vue";
import { Checkbox } from "./ui/checkbox";
import { RouterLink } from "vue-router";
import type { orderT } from "@/types";
import UiIcon from "./ui/UiIcon.vue";
import { store } from "@/store";
import { ref } from "vue";

defineProps<{ orders: orderT[] }>();

const checkedOrders = ref<string[]>([]);

const checkThisOrders = (IsIncluded: boolean, id: string) => {
  IsIncluded
    ? checkedOrders.value.push(id)
    : checkedOrders.value.splice(checkedOrders.value.indexOf(id), 1);
};

const toggleThisOrders = (Order: orderT, name: string) => {
  store.setters.updateStore({ key: "row", value: Order });
  store.setters.updateStore({ key: "name", value: name });
  store.setters.updateStore({ key: "show", value: true });
};
</script>

<template>
  <div class="flex flex-col w-full h-full">
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
              {{ globalTranslate(`Orders.index.feilds[${index}]`) }}
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
                  name: 'SellerDetails',
                  params: { id: order.seller_id },
                }"
              >
                {{ order.seller.name }}
              </RouterLink>
            </div>
          </td>
          <td class="p-2">
            <div class="text-left whitespace-nowrap overflow-ellipsis">
              <span v-if="order.order_items?.length">
                {{ order.order_items?.length }}
                {{ order.order_items?.length == 1 ? " Product" : " Products" }}
              </span>
              <span v-else class="text-red-400">No products</span>
            </div>
          </td>
          <td class="p-2">
            <div
              class="text-left font-medium uppercase whitespace-nowrap overflow-ellipsis"
            >
              <span
                v-if="order.status"
                class="px-2 py-[1px] rounded-full"
                :class="{
                  'bg-yellow-300/60 text-yellow-800': order.status == 'pending',
                  'bg-green-300/60 text-green-800': order.status == 'delivered',
                  'bg-red-300/60 text-red-800':
                    order.status != 'pending' && order.status != 'delivered',
                }"
              >
                {{
                  globalTranslate(`Orders.status.${order.status.toLowerCase()}`)
                }}
              </span>
              <span v-else class="text-red-400">No status</span>
            </div>
          </td>
          <td class="p-2">
            <div class="text-left whitespace-nowrap overflow-ellipsis">
              <span v-if="!order.created_at" class="text-red-400">No date</span>
              <span v-else>
                {{ order.created_at }}
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
