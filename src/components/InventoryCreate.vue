<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { INVENTORY_CREATE } from "@/constants/defaultValues";
import { globalTranslate } from "@/utils/globalTranslate";
import { onBeforeMount, ref, reactive } from "vue";
import ComboBox from "./ui/combobox/ComboBox.vue";
import type { newInventoryMvmT } from "@/types";
import { invoke } from "@tauri-apps/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { store } from "@/store";

const { updateQueryParams } = useUpdateRouteQueryParams();

const inventoryMvm = reactive<newInventoryMvmT>(
  Object.assign({}, INVENTORY_CREATE)
);

const products = ref<{ label: string; value: string }[]>([]);

onBeforeMount(async () => {
  // @ts-ignore
  const res = await Promise.allSettled([invoke("get_all_products")]);
  if (res[0].status === "fulfilled") {
    // @ts-ignore
    products.value = res[0].value;
  }
});

const createNewInventory = async () => {
  if (inventoryMvm.product_id !== "" && inventoryMvm.quantity !== 0) {
    try {
      await invoke("insert_inventory_mvm", { inventory: inventoryMvm });
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
};
</script>
<template>
  <div class="w-1/2 h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
    <h1
      class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center"
    >
      {{ globalTranslate("Inventory.create.title") }}
    </h1>
    <div class="h-full w-full flex flex-col gap-2">
      <ComboBox
        :label="globalTranslate('Inventory.create.select')"
        v-model="inventoryMvm.product_id"
        :items="products"
      />
      <Input
        type="number"
        :placeHolder="globalTranslate('Inventory.create.placeholder')"
        v-model="inventoryMvm.quantity"
      />
    </div>
    <div class="flex">
      <Button class="w-full" @click="createNewInventory">
        {{ globalTranslate("Inventory.create.button") }}
      </Button>
    </div>
  </div>
</template>
