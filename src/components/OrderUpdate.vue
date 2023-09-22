<script setup lang="ts">
import { globalTranslate } from "@/utils/globalTranslate";
import { ComboBox } from "./ui/combobox";
import type { orderT, updateOrdersT } from "@/types";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { invoke } from "@tauri-apps/api";
import { Button } from "./ui/button";
import UiIcon from "./ui/UiIcon.vue";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { ref, computed, reactive, onBeforeMount, onBeforeUnmount } from "vue";
import { store } from "@/store";
import { ORDER_UPDATE } from "@/constants/defaultValues";

defineProps<{ orders: orderT[] }>();

const checkedOrders = ref<number[]>([]);

const checkThisOrders = (IsIncluded: boolean, id: number) => {
  IsIncluded
    ? checkedOrders.value.push(id)
    : checkedOrders.value.splice(checkedOrders.value.indexOf(id), 1);
};

const toggleThisOrders = (Order: orderT, name: string) => {
  store.setters.updateStore({ key: "row", value: Order });
  store.setters.updateStore({ key: "name", value: name });
  store.setters.updateStore({ key: "show", value: true });
};

const { updateQueryParams } = useUpdateRouteQueryParams();

const OrdersRow = computed(() => store.getters.getSelectedRow<orderT>());

const sellers = ref<{ label: string; value: number }[]>([]);
const products = ref<{ label: string; value: number }[]>([]);

const updateOrder = reactive<updateOrdersT>(
  OrdersRow.value ? OrdersRow.value : ORDER_UPDATE
);

onBeforeMount(async () => {
  const res = await Promise.allSettled([
    invoke<{ label: string; value: number }[]>("get_all_sellers"),
    invoke<{ label: string; value: number }[]>("get_all_products"),
  ]);

  if (res[0].status === "fulfilled") sellers.value = res[0].value;
  if (res[1].status === "fulfilled") products.value = res[1].value;
});

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

async function deleteOneOrderItem(id: number) {
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
        <ComboBox :items="sellers">
          <!-- v-model="updateOrder.seller?.name" -->
          {{ globalTranslate("Orders.update.details.seller.select") }}
        </ComboBox>
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
              <Checkbox />
              <span>{{ globalTranslate("Orders.status.delivered") }}</span>
            </div>
            <div
              class="h-full w-full flex flex-row flex-nowrap items-center justify-center gap-2"
            >
              <Checkbox />
              <span>{{ globalTranslate("Orders.status.pending") }}</span>
            </div>
            <div
              class="h-full w-full flex flex-row justify-end flex-nowrap items-center gap-2"
            >
              <Checkbox />
              <span>{{ globalTranslate("Orders.status.canceled") }}</span>
            </div>
          </div>
        </div>
        <div class="w-full h-full flex flex-col gap-1">
          <Button
            @click="
              () =>
                updateOrder.order_items?.push({ product_id: 0, quantity: 0 })
            "
          >
            {{ globalTranslate("Orders.update.details.order.add") }}
          </Button>
          <div
            class="w-full grid grid-cols-[1fr_1fr_1fr_36px] pb-10 overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1"
          >
            <div class="flex flex-col gap-2">
              <ComboBox
                v-for="(item, index) in updateOrder.order_items"
                :key="index"
                :items="products"
              >
                <!-- v-model="item.product?.name" -->
                {{ globalTranslate("Orders.update.details.order.select") }}
              </ComboBox>
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
                  <!-- v-model="item.quantity" -->
                  <!-- {{ unite: () => (
                  <span
                    class="h-full text-gray-400 rounded-[4px] px-2 border-r-2 flex items-center justify-center"
                  >
                    Item
                  </span>
                  ), }} -->
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
                  <!-- {{ unite: () => (
                  <span
                    class="h-full text-gray-400 rounded-[4px] px-2 border-r-2 flex items-center justify-center"
                  >
                    DH
                  </span>
                  ), }} -->
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
