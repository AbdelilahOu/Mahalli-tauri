<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { computed, onBeforeUnmount } from "vue";
import { globalTranslate } from "@/utils/globalTranslate";
import { Button } from "./ui/button";
import { invoke } from "@tauri-apps/api";
import { store } from "@/store";
import type { sellerT } from "@/types";

const { updateQueryParams } = useUpdateRouteQueryParams();

const seller = computed(() => store.getters.getSelectedRow<sellerT>());

const deleteTheSeller = async () => {
  let id = seller.value?.id;
  if (id) {
    try {
      await invoke("delete_seller", { id });
      // toggle refresh
      updateQueryParams({
        refresh: "refresh-delete-" + Math.random() * 9999,
      });
    } catch (error) {
      console.log(error);
    } finally {
      store.setters.updateStore({ key: "show", value: false });
    }
  }
};

const cancelDelete = () => {
  store.setters.updateStore({ key: "show", value: false });
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
      {{ globalTranslate("Sellers.delete.title") }} {{ seller.name }} ?
    </h1>
    <div class="flex gap-2">
      <Button @click="deleteTheSeller">
        {{ globalTranslate("Sellers.delete.yes") }}
      </Button>
      <Button @click="cancelDelete">
        {{ globalTranslate("Sellers.delete.no") }}
      </Button>
    </div>
  </div>
</template>
