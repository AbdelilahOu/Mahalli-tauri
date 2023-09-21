<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { ref, onBeforeMount, reactive } from "vue";
import { globalTranslate } from "@/utils/globalTranslate";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { invoke } from "@tauri-apps/api";
import { ComboBox } from "./ui/combobox";
import { Input } from "./ui/input";
import UiIcon from "./ui/UiIcon.vue";
import { store } from "@/store";
import { ORDER_CREATE, ORDER_ITEM_CREATE } from "@/constants/defaultValues";
import type { newOrdersItemT, newOrdersT } from "@/types";

const { updateQueryParams } = useUpdateRouteQueryParams();
const order_items = ref<newOrdersItemT[]>(ORDER_ITEM_CREATE);
const newOrder = reactive<newOrdersT>(ORDER_CREATE);
const sellers = ref<{ label: string; value: number }[]>([]);
const products = ref<{ label: string; value: number }[]>([]);
const isFlash = ref<boolean>(false);

onBeforeMount(async () => {
  const res = await Promise.allSettled([
    invoke<{ label: string; value: number }[]>("get_all_sellers"),
    invoke<{ label: string; value: number }[]>("get_all_products"),
  ]);

  if (res[0].status === "fulfilled") sellers.value = res[0].value;
  if (res[1].status === "fulfilled") products.value = res[1].value;
});

const createNewOrders = async () => {
  isFlash.value = true;
  newOrder.order_items = order_items.value.filter(
    (item) => item.product_id !== 0 && item.quantity !== 0
  );

  if (newOrder.seller_id && newOrder.order_items.length !== 0) {
    try {
      await invoke("insert_order", {
        order: newOrder,
      });
      // toggle refresh
      updateQueryParams({
        refresh: "refresh-create-" + Math.random() * 9999,
      });
    } catch (error) {
      console.log(error);
    } finally {
      store.setters.updateStore({ key: "show", value: false });
    }
  }

  setTimeout(() => {
    isFlash.value = false;
  }, 1000);
};
</script>

<template>
  <div class="w-5/6 lg:w-1/2 rounded-[4px] relative h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
    <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
      {{ globalTranslate("Orders.create.title") }}
    </h1>
    <div class="h-full w-full grid grid-cols-1 gap-2">
      <div class="w-full h-full flex flex-col gap-1">
        <h1 class="font-medium">
          {{ globalTranslate("Orders.create.details.seller.title") }}
        </h1>
        <ComboBox
          :items="sellers"
        >
          {{ globalTranslate("Orders.create.details.seller.select") }}
        </ComboBox>
      </div>
      <div class="w-full h-full flex flex-col gap-1">
        <h1 class="font-medium">
          {{ globalTranslate("Orders.create.details.order.title") }}
        </h1>
        <div class="w-full h-full flex flex-col mb-1 gap-1">
          <div class="flex justify-between w-full">
            <div class="h-full w-full flex flex-row flex-nowrap items-center gap-2">
              <Checkbox
              />
              <span>{{ globalTranslate("Orders.status.delivered") }}</span>
            </div>
            <div class="h-full w-full flex flex-row flex-nowrap items-center justify-center gap-2">
              <Checkbox
              />
              <span>{{ globalTranslate("Orders.status.pending") }}</span>
            </div>
            <div class="h-full w-full flex flex-row justify-end flex-nowrap items-center gap-2">
              <Checkbox
              />
              <span>{{ globalTranslate("Orders.status.canceled") }}</span>
            </div>
          </div>
        </div>
        <div class="w-full h-full flex flex-col gap-1">
          <Button
            @click="order_items.push({ product_id: 0, quantity: 0, price: 0 })"
          >
            {{ globalTranslate("Orders.create.details.order.add") }}
          </Button>
          <div class="w-full grid grid-cols-[1fr_1fr_1fr_36px] pb-10 overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1">
            <div class="flex flex-col gap-2">
              <template v-for="(item, index) in order_items">
                <ComboBox
                  :items="products"
                >
                  {{ globalTranslate("Orders.create.details.order.select") }}
                </ComboBox>
              </template>
            </div>
            <div class="flex flex-col gap-2">
              <template v-for="(item, index) in order_items">
                <div class="h-full w-full flex items-center relative">
                  <Input
                    class="border-r-0"
                    :placeHolder="globalTranslate('Orders.create.details.order.placeholder[0]')"
                    type="number"
                    v-model="item.quantity"
                  >
                    <!-- {{
                      unite: () => (
                        <span class="h-full text-gray-400 rounded-[4px] px-2 border-r-2  flex items-center justify-center">
                          Item
                        </span>
                      ),
                    }} -->
                  </Input>
                </div>
              </template>
            </div>
            <div class="flex flex-col gap-2">
              <template v-for="(item, index) in order_items">
                <div class="h-full w-full flex items-center relative">
                  <Input
                    class="border-r-0"
                    :placeHolder="globalTranslate('Orders.create.details.order.placeholder[1]')"
                    type="number"
                    v-model="item.price"
                  >
                    <!-- {{
                      unite: () => (
                        <span class="h-full text-gray-400 rounded-[4px] px-2 border-r-2  flex items-center justify-center">
                          DH
                        </span>
                      ),
                    }} -->
                  </Input>
                </div>
              </template>
            </div>

            <div class="flex flex-col gap-2">
              <template v-for="(item, index) in order_items">
                <div
                  @click="order_items.splice(index, 1)"
                  class="flex justify-center bg-gray-100 hover:bg-gray-300 transition-all duration-200  rounded-[4px] items-center w-full h-full"
                >
                  <UiIcon name="delete" />
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <Button class="w-full" @click="createNewOrders()">
        {{ globalTranslate("Orders.create.button") }}
      </Button>
    </div>
  </div>
</template>
</script>
