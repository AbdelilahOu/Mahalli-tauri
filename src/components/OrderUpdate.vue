<script setup lang="ts">
import { ref, computed, reactive, onBeforeMount, onBeforeUnmount } from "vue";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { useI18n } from "vue-i18n";
import { ORDER_UPDATE } from "@/constants/defaultValues";
import type { orderT, updateOrdersT } from "@/types";
import ComboBox from "./ui/combobox/ComboBox.vue";
import { Checkbox } from "./ui/checkbox";
import { invoke } from "@tauri-apps/api";
import { Button } from "./ui/button";
import UiIcon from "./ui/UiIcon.vue";
import { Input } from "./ui/input";
import { store } from "@/store";
import UiModalCard from "./ui/UiModalCard.vue";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { t } = useI18n();

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
      hideModal();
    }
  }
};

const hideModal = () => {
  store.setters.updateStore({ key: "show", value: false });
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
  <UiModalCard
    class="w-5/6 lg:w-1/2 relative h-fit rounded-[4px] z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]"
  >
    <template #title>
      {{ t("Orders.update.title") }} N° {{ updateOrder.id }}
    </template>
    <template #content>
      <div class="h-full w-full grid grid-cols-1 gap-2">
        <div class="w-full h-full flex flex-col gap-1">
          <Label for="seller_id">
            {{ t("Orders.update.details.seller.title") }}
          </Label>
          <span id="seller_id">
            <ComboBox
              :label="t('Orders.update.details.seller.select')"
              v-model="updateOrder.seller_id"
              :items="sellers"
            />
          </span>
        </div>
        <Separator />
        <div class="w-full h-full flex flex-col gap-1">
          <Label for="status">
            {{ t("Orders.update.details.order.title") }}
          </Label>
          <div id="status" class="w-full h-full flex flex-col mb-1 gap-1">
            <div class="flex justify-between w-full">
              <div
                class="h-full w-full flex flex-row flex-nowrap items-center gap-2"
              >
                <Checkbox
                  id="status_1"
                  :checked="updateOrder.status === 'delivered'"
                  @update:checked="() => (updateOrder.status = 'delivered')"
                />
                <Label for="status_1">{{ t("Orders.status.delivered") }}</Label>
              </div>
              <div
                class="h-full w-full flex flex-row flex-nowrap items-center justify-center gap-2"
              >
                <Checkbox
                  id="status_2"
                  :checked="updateOrder.status === 'pending'"
                  @update:checked="() => (updateOrder.status = 'pending')"
                />
                <Label for="status_2">{{ t("Orders.status.pending") }}</Label>
              </div>
              <div
                class="h-full w-full flex flex-row justify-end flex-nowrap items-center gap-2"
              >
                <Checkbox
                  id="status_3"
                  :checked="updateOrder.status === 'canceled'"
                  @update:checked="() => (updateOrder.status = 'canceled')"
                />
                <Label for="status_3">{{ t("Orders.status.canceled") }}</Label>
              </div>
            </div>
          </div>
        </div>
        <Separator />
        <div class="w-full h-full flex flex-col gap-1">
          <Button @click="addOrderItem">
            {{ t("Orders.update.details.order.add") }}
          </Button>
          <div
            class="w-full pt-1 grid grid-cols-[1fr_1fr_1fr_36px] pb-10 overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1"
          >
            <template
              v-for="(item, index) in updateOrder.order_items"
              :key="index"
            >
              <ComboBox
                :label="t('Orders.update.details.order.select')"
                v-model="item.product_id"
                :items="products"
              />
              <Input
                v-model="item.quantity"
                class="border-r-0"
                :placeHolder="t('Orders.create.details.order.placeholder[0]')"
                type="number"
              >
                <template #unite> Item </template>
              </Input>
              <Input
                v-model="item.price"
                class="border-r-0"
                :placeHolder="t('Orders.create.details.order.placeholder[1]')"
                type="number"
              >
                <template #unite> DH </template>
              </Input>
              <div
                @click="deleteOrderItem(index)"
                class="flex justify-center bg-gray-100 hover:bg-gray-300 transition-all duration-200 rounded-[4px] items-center w-full h-full"
              >
                <UiIcon name="delete" />
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="grid grid-cols-3 gap-2">
        <Button class="col-span-2" @click="updateTheOrders">
          {{ t("Orders.update.button") }}
        </Button>
        <Button variant="outline" @click="hideModal"> Cancel </Button>
      </div>
    </template>
  </UiModalCard>
</template>
