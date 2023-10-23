<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { useI18n } from "vue-i18n";
import { computed, onBeforeUnmount } from "vue";
import UiModalCard from "./ui/UiModalCard.vue";
import { invoke } from "@tauri-apps/api";
import type { sellerT } from "@/types";
import { Button } from "./ui/button";
import { store } from "@/store";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { t } = useI18n();

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
  <UiModalCard>
    <template #title> {{ t("s.d.title") }} {{ seller.name }} ? </template>
    <template #footer>
      <div class="grid grid-cols-3 gap-2">
        <Button class="col-span-2" @click="deleteTheSeller">
          {{ t("s.d.yes") }}
        </Button>
        <Button variant="outline" @click="cancelDelete">
          {{ t("s.d.no") }}
        </Button>
      </div>
    </template>
  </UiModalCard>
</template>
