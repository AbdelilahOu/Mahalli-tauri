<script setup lang="ts">
import { ORDER_CREATE, ORDER_ITEM_CREATE } from "@/constants/defaultValues";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import type { newOrdersItemT, newOrdersT } from "@/types";
import { globalTranslate } from "@/utils/globalTranslate";
import { ref, onBeforeMount, reactive } from "vue";
import ComboBox from "./ui/combobox/ComboBox.vue";
import { Checkbox } from "./ui/checkbox";
import { invoke } from "@tauri-apps/api";
import UiIcon from "./ui/UiIcon.vue";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { store } from "@/store";
import UiModalCard from "./ui/UiModalCard.vue";

const { updateQueryParams } = useUpdateRouteQueryParams();
const order_items = ref<newOrdersItemT[]>(
  ORDER_ITEM_CREATE.map((a) => Object.assign({}, a))
);
const newOrder = reactive<newOrdersT>(Object.assign({}, ORDER_CREATE));
const sellers = ref<{ label: string; value: string }[]>([]);
const products = ref<{ label: string; value: string }[]>([]);
const isLoading = ref<boolean>(false);

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
  order_items.value.push({
    product_id: undefined,
    quantity: undefined,
    price: undefined,
  });
};

const removeOrderItem = (index: number) => {
  order_items.value.splice(index, 1);
};

const createNewOrders = async () => {
  isLoading.value = true;
  newOrder.order_items = order_items.value.filter(
    (item) => item.product_id && item.quantity
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
      isLoading.value = false;
      hideModal();
    }
    return;
  }

  isLoading.value = false;
};

const hideModal = () => {
  store.setters.updateStore({ key: "show", value: false });
};
</script>

<template>
  <UiModalCard
    class="w-5/6 lg:w-1/2 rounded-[4px] relative h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]"
  >
    <template #title>
      {{ globalTranslate("Orders.create.title") }}
    </template>
    <template #content>
      <div class="h-full w-full grid grid-cols-1 gap-2">
        <div class="w-full h-full flex flex-col gap-1">
          <h1 class="font-medium">
            {{ globalTranslate("Orders.create.details.seller.title") }}
          </h1>
          <ComboBox
            :label="globalTranslate('Orders.create.details.seller.select')"
            v-model="newOrder.seller_id"
            :items="sellers"
          />
        </div>
        <div class="w-full h-full flex flex-col gap-1">
          <h1 class="font-medium">
            {{ globalTranslate("Orders.create.details.order.title") }}
          </h1>
          <div class="w-full h-full flex flex-col mb-1 gap-1">
            <div class="flex justify-between w-full">
              <div
                class="h-full w-full flex flex-row flex-nowrap items-center gap-2"
              >
                <Checkbox
                  @update:checked="() => (newOrder.status = 'delivered')"
                />
                <span>{{ globalTranslate("Orders.status.delivered") }}</span>
              </div>
              <div
                class="h-full w-full flex flex-row flex-nowrap items-center justify-center gap-2"
              >
                <Checkbox
                  @update:checked="() => (newOrder.status = 'pending')"
                />
                <span>{{ globalTranslate("Orders.status.pending") }}</span>
              </div>
              <div
                class="h-full w-full flex flex-row justify-end flex-nowrap items-center gap-2"
              >
                <Checkbox
                  @update:checked="() => (newOrder.status = 'canceled')"
                />
                <span>{{ globalTranslate("Orders.status.canceled") }}</span>
              </div>
            </div>
          </div>
          <div class="w-full h-full flex flex-col gap-1">
            <Button @click="addOrderItem">
              {{ globalTranslate("Orders.create.details.order.add") }}
            </Button>
            <div
              class="w-full grid pt-1 grid-cols-[1fr_1fr_1fr_36px] pb-10 overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1"
            >
              <div class="flex flex-col gap-2">
                <template v-for="(item, index) in order_items">
                  <ComboBox
                    :label="
                      globalTranslate('Orders.create.details.order.select')
                    "
                    v-model="item.product_id"
                    :items="products"
                  />
                </template>
              </div>
              <div class="flex flex-col gap-2">
                <template v-for="(item, index) in order_items">
                  <div class="h-full w-full flex items-center relative">
                    <Input
                      class="border-r-0"
                      :placeHolder="
                        globalTranslate(
                          'Orders.create.details.order.placeholder[0]'
                        )
                      "
                      type="number"
                      v-model="item.quantity"
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
                </template>
              </div>
              <div class="flex flex-col gap-2">
                <template v-for="(item, index) in order_items">
                  <div class="h-full w-full flex items-center relative">
                    <Input
                      class="border-r-0"
                      :placeHolder="
                        globalTranslate(
                          'Orders.create.details.order.placeholder[1]'
                        )
                      "
                      type="number"
                      v-model="item.price"
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
                </template>
              </div>

              <div class="flex flex-col gap-2">
                <template v-for="(item, index) in order_items">
                  <div
                    @click="removeOrderItem(index)"
                    class="flex justify-center bg-gray-100 hover:bg-gray-300 transition-all duration-200 rounded-[4px] items-center w-full h-full"
                  >
                    <UiIcon isStyled name="delete" />
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="grid w-full grid-cols-3 gap-2">
        <Button class="col-span-2" @click="createNewOrders()">
          {{ globalTranslate("Orders.create.button") }}
        </Button>
        <Button @click="hideModal" variant="outline"> Cancel </Button>
      </div>
    </template>
  </UiModalCard>
</template>
