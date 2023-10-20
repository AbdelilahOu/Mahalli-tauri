<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { globalTranslate } from "@/utils/globalTranslate";
import { computed, onBeforeUnmount } from "vue";
import { invoke } from "@tauri-apps/api";
import type { invoiceT } from "@/types";
import { Button } from "./ui/button";
import { store } from "@/store";
import UiModalCard from "./ui/UiModalCard.vue";

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
  <UiModalCard>
    <template #title>
      {{ globalTranslate("Invoices.delete.title") }} n° {{ invoice.id }} ?
    </template>
    <template #footer>
      <div class="grid grid-cols-3 gap-2">
        <Button class="col-span-2" @click="deleteTheInvoice">
          {{ globalTranslate("Invoices.delete.yes") }}
        </Button>
        <Button variant="outline" @click="cancelDelete">
          {{ globalTranslate("Invoices.delete.no") }}
        </Button>
      </div>
    </template>
  </UiModalCard>
</template>
