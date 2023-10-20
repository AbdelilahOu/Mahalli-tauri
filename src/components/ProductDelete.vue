<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { globalTranslate } from "@/utils/globalTranslate";
import UiModalCard from "./ui/UiModalCard.vue";
import { invoke } from "@tauri-apps/api";
import type { productT } from "@/types";
import { Button } from "./ui/button";
import { store } from "@/store";
import { computed } from "vue";

const { updateQueryParams } = useUpdateRouteQueryParams();

const product = computed(() => store.getters.getSelectedRow<productT>());

const deleteTheProduct = async () => {
  const id = product.value?.id;
  if (id) {
    try {
      await invoke("delete_product", { id });
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
</script>

<template>
  <UiModalCard>
    <template #title>
      {{ globalTranslate("Products.delete.title") }} {{ product.name }} ?
    </template>
    <template #footer>
      <div class="grid grid-cols-3 gap-2">
        <Button class="col-span-2" @click="deleteTheProduct">
          {{ globalTranslate("Products.delete.yes") }}
        </Button>
        <Button variant="outline" @click="cancelDelete">
          {{ globalTranslate("Products.delete.no") }}
        </Button>
      </div>
    </template>
  </UiModalCard>
</template>
