<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { useI18n } from "vue-i18n";
import { computed, onBeforeUnmount } from "vue";
import UiModalCard from "./ui/UiModalCard.vue";
import { invoke } from "@tauri-apps/api";
import { Button } from "./ui/button";
import { store } from "@/store";
import type { SupplierT } from "@/schemas/supplier.schema";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { t } = useI18n();

const supplier = computed(() => store.getters.getSelectedRow<SupplierT>());

const deleteTheSupplier = async () => {
  let id = supplier.value?.id;
  if (id) {
    try {
      await invoke("delete_supplier", { id });
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
    <template #title> {{ t("s.d.title") }} {{ supplier.fullname }} ? </template>
    <template #footer>
      <div class="grid grid-cols-3 gap-2">
        <Button class="col-span-2" @click="deleteTheSupplier">
          {{ t("g.b.d") }}
        </Button>
        <Button variant="outline" @click="cancelDelete">
          {{ t("g.b.no") }}
        </Button>
      </div>
    </template>
  </UiModalCard>
</template>
