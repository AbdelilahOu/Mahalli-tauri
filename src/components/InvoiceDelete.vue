<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { globalTranslate } from "@/utils/globalTranslate";
import { computed, onBeforeUnmount } from "vue";
import { invoke } from "@tauri-apps/api";
import type { invoiceT } from "@/types";
import { Button } from "./ui/button";
import { store } from "@/store";

const { updateQueryParams } = useUpdateRouteQueryParams();

const invoice = computed(() => store.getters.getSelectedRow<invoiceT>());

const deleteTheInvoice = async () => {
  const id = invoice.value?.id;
  if (id) {
    try {
      await invoke("delete_invoice", { id });
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
      {{ globalTranslate("Invoices.delete.title") }} n° {{ invoice.id }} ?
    </h1>
    <div class="flex gap-2">
      <Button @click="deleteTheInvoice">
        {{ globalTranslate("Invoices.delete.yes") }}
      </Button>
      <Button @click="cancelDelete">
        {{ globalTranslate("Invoices.delete.no") }}
      </Button>
    </div>
  </div>
</template>
