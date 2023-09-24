<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from "vue";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import type { productT, updateProductT } from "@/types";
import { Input } from "./ui/input";
import { invoke } from "@tauri-apps/api";
import { Button } from "./ui/button";
import { store } from "@/store";
import { PRODUCT_UPDATE } from "@/constants/defaultValues";
import { globalTranslate } from "@/utils/globalTranslate";

const { updateQueryParams } = useUpdateRouteQueryParams();

const ProductRow = computed(() => store.getters.getSelectedRow<productT>());

const updateProduct = ref<updateProductT>({
  ...(ProductRow.value.id ? ProductRow.value : PRODUCT_UPDATE),
  quantity: 0,
});

const updateTheProduct = async () => {
  if (updateProduct.value.id) {
    try {
      await invoke("update_product", {
        product: updateProduct.value,
        id: updateProduct.value.id,
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

onBeforeUnmount(() => {
  store.setters.updateStore({ key: "row", value: null });
});
</script>

<template>
  <div
    class="w-1/2 h-fit rounded-[4px] z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]"
  >
    <h1
      class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center"
    >
      {{ globalTranslate("Products.update.title") }}
    </h1>
    <div class="h-full w-full flex flex-col gap-2">
      <Input v-model="updateProduct.name" type="text" placeHolder="Name" />
      <Input v-model="updateProduct.price" type="number" placeHolder="Price">
        <template #unite>
          <span
            class="h-full text-gray-400 rounded-[4px] px-2 flex items-center justify-center"
          >
            DH
          </span>
        </template>
      </Input>
      <Input v-model="updateProduct.tva" type="number" placeHolder="TVA" />
      <Input
        v-model="updateProduct.quantity"
        type="number"
        placeHolder="Add Inventory"
      >
        <template #unite>
          <span
            class="h-full text-gray-400 rounded-[4px] px-2 flex items-center justify-center"
          >
            Item
          </span>
        </template>
      </Input>
      <Input
        v-model="updateProduct.description"
        type="text"
        placeHolder="Address"
      />
    </div>
    <div class="flex">
      <Button class="w-full" @click="updateTheProduct()">
        Update {{ updateProduct.name }}
      </Button>
    </div>
  </div>
</template>
