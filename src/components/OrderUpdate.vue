<script setup lang="ts">
import { ref, computed, reactive, onBeforeMount, onBeforeUnmount } from "vue";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { globalTranslate } from "@/utils/globalTranslate";
import { ORDER_UPDATE } from "@/constants/defaultValues";
import type { orderT, updateOrdersT } from "@/types";
import ComboBox from "./ui/combobox/ComboBox.vue";
import { Checkbox } from "./ui/checkbox";
import { invoke } from "@tauri-apps/api";
import { Button } from "./ui/button";
import UiIcon from "./ui/UiIcon.vue";
import { Input } from "./ui/input";
import { store } from "@/store";

const { updateQueryParams } = useUpdateRouteQueryParams();

const OrdersRow = computed(() => store.getters.getSelectedRow<orderT>());

const sellers = ref<{ label: string; value: string }[]>([]);
const products = ref<{ label: string; value: string }[]>([]);

const updateOrder = reactive<updateOrdersT>(
  OrdersRow.value ? OrdersRow.value : ORDER_UPDATE
);

onBeforeMount(async () => {
  // @ts-ignore
  const res = await Promise.allSettled([
    invoke<{ label: string; value: string }[]>("get_all_sellers"),
    invoke<{ label: string; value: string }[]>("get_all_products"),
  ]);

  if (res[0].status === "fulfilled") sellers.value = res[0].value;
  if (res[1].status === "fulfilled") products.value = res[1].value;
});

const addOrderItem = () => {
  updateOrder.order_items.push({
    product_id: undefined,
    quantity: undefined,
    price: undefined,
  });
};

const updateTheOrders = async () => {
  if (updateOrder.id) {
    try {
      await invoke("update_order", {
        order: updateOrder,
        id: updateOrder.id,
      });
      // toggle refresh
      updateQueryParams({
        refresh: "refresh-update-" + Math.random() * 9999,
      });
    } catch (error) {
      console.log(error);
    } finally {
      store.setters.updateStore({ key: "show", value: false });
    }
  }
};

async function deleteOneOrderItem(id: string) {
  try {
    await invoke("delete_order_items", { id });
  } catch (error) {
    console.log(error);
  }
}

const deleteOrderItem = (index: number) => {
  const item = updateOrder.order_items?.splice(index, 1)[0];
  if (item?.id) deleteOneOrderItem(item.id);
};

onBeforeUnmount(() => store.setters.updateStore({ key: "row", value: null }));
</script>

<template>
  <div
    class="w-5/6 lg:w-1/2 relative h-fit rounded-[4px] z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]"
  >
    <h1
      class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center"
    >
      {{ globalTranslate("Orders.update.title") }} N° {{ updateOrder.id }}
    </h1>
    <div class="h-full w-full grid grid-cols-1 gap-2">
      <div class="w-full h-full flex flex-col gap-1">
        <h1 class="font-medium">
          {{ globalTranslate("Orders.update.details.seller.title") }}
        </h1>
        <ComboBox
          :label="globalTranslate('Orders.update.details.seller.select')"
          v-model="updateOrder.seller_id"
          :items="sellers"
        />
      </div>
      <div class="w-full h-full flex flex-col gap-1">
        <h1 class="font-medium">
          {{ globalTranslate("Orders.update.details.order.title") }}
        </h1>
        <div class="w-full h-full flex flex-col mb-1 gap-1">
          <div class="flex justify-between w-full">
            <div
              class="h-full w-full flex flex-row flex-nowrap items-center gap-2"
            >
              <Checkbox
                :checked="updateOrder.status === 'delivered'"
                @update:checked="() => (updateOrder.status = 'delivered')"
              />
              <span>{{ globalTranslate("Orders.status.delivered") }}</span>
            </div>
            <div
              class="h-full w-full flex flex-row flex-nowrap items-center justify-center gap-2"
            >
              <Checkbox
                :checked="updateOrder.status === 'pending'"
                @update:checked="() => (updateOrder.status = 'pending')"
              />
              <span>{{ globalTranslate("Orders.status.pending") }}</span>
            </div>
            <div
              class="h-full w-full flex flex-row justify-end flex-nowrap items-center gap-2"
            >
              <Checkbox
                :checked="updateOrder.status === 'canceled'"
                @update:checked="() => (updateOrder.status = 'canceled')"
              />
              <span>{{ globalTranslate("Orders.status.canceled") }}</span>
            </div>
          </div>
        </div>
        <div class="w-full h-full flex flex-col gap-1">
          <Button @click="addOrderItem">
            {{ globalTranslate("Orders.update.details.order.add") }}
          </Button>
          <div
            class="w-full pt-1 grid grid-cols-[1fr_1fr_1fr_36px] pb-10 overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1"
          >
            <div class="flex flex-col gap-2">
              <template
                v-for="(item, index) in updateOrder.order_items"
                :key="index"
              >
                <ComboBox
                  :label="globalTranslate('Orders.update.details.order.select')"
                  v-model="item.product_id"
                  :items="products"
                />
              </template>
            </div>
            <div class="flex flex-col gap-2">
              <div
                class="h-full flex w-full items-center relative"
                v-for="(item, index) in updateOrder.order_items"
                :key="index"
              >
                <Input
                  v-model="item.quantity"
                  class="border-r-0"
                  :placeHolder="
                    globalTranslate(
                      'Orders.create.details.order.placeholder[0]'
                    )
                  "
                  type="number"
                >
                  <template #unite>
                    <span
                      class="h-full text-gray-400 rounded-[4px] px-2 flex items-center justify-center"
                    >
                      Item
                    </span>
                  </template>
                </Input>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <div
                class="h-full flex w-full items-center relative"
                v-for="(item, index) in updateOrder.order_items"
                :key="index"
              >
                <Input
                  v-model="item.price"
                  class="border-r-0"
                  :placeHolder="
                    globalTranslate(
                      'Orders.create.details.order.placeholder[1]'
                    )
                  "
                  type="number"
                >
                  <template #unite>
                    <span
                      class="h-full text-gray-400 rounded-[4px] px-2 flex items-center justify-center"
                    >
                      DH
                    </span>
                  </template>
                </Input>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <div
                @click="deleteOrderItem(index)"
                class="flex justify-center bg-gray-100 hover:bg-gray-300 transition-all duration-200 rounded-[4px] items-center w-full h-full"
                v-for="(item, index) in updateOrder.order_items"
                :key="index"
              >
                <UiIcon name="delete" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <Button class="w-full" @click="updateTheOrders">
        {{ globalTranslate("Orders.update.button") }}
      </Button>
    </div>
  </div>
</template>
