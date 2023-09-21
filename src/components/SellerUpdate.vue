<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from "vue";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { globalTranslate } from "@/utils/globalTranslate";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { invoke } from "@tauri-apps/api";
import { store } from "@/store";
import { SELLER_UPDATE } from "@/constants/defaultValues";
import type { sellerT, updateSellerT } from "@/types";

const { updateQueryParams } = useUpdateRouteQueryParams();

const SellerRow = computed(() => store.getters.getSelectedRow<sellerT>());
const updateSeller = ref<updateSellerT>(
  SellerRow.value ? SellerRow.value : SELLER_UPDATE
);

const updateTheSeller = async () => {
  if (updateSeller.value?.id) {
    try {
      await invoke("update_seller", {
        seller: updateSeller.value,
        id: updateSeller.value.id,
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

onBeforeUnmount(() => store.setters.updateStore({ key: "row", value: null }));
</script>

<template>
  <div
    class="w-1/2 h-fit rounded-[4px] z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]"
  >
    <h1
      class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center"
    >
      {{ globalTranslate("Sellers.update.title") }}
    </h1>
    <div class="h-full w-full flex flex-col gap-2">
      <Input
        v-model="updateSeller.name"
        type="text"
        placeHolder="{{ globalTranslate('Sellers.create.placeholders[0]') }}"
      />
      <Input
        v-model="updateSeller.email"
        type="text"
        placeHolder="{{ globalTranslate('Sellers.create.placeholders[1]') }}"
      />
      <Input
        v-model="updateSeller.phone"
        type="text"
        placeHolder="{{ globalTranslate('Sellers.create.placeholders[2]') }}"
      />
      <Input
        v-model="updateSeller.address"
        type="text"
        placeHolder="{{ globalTranslate('Sellers.create.placeholders[3]') }}"
      />
    </div>
    <div class="flex">
      <Button class="w-full" @click="updateTheSeller()">
        {{ globalTranslate("Sellers.update.button") }} {{ updateSeller.name }}
      </Button>
    </div>
  </div>
</template>
