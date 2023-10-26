<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { useI18n } from "vue-i18n";
import UiModalCard from "./ui/UiModalCard.vue";
import { invoke } from "@tauri-apps/api";
import type { productT } from "@/types";
import { Button } from "./ui/button";
import { store } from "@/store";
import { computed } from "vue";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { t } = useI18n();

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
    <template #title> {{ t("p.d.title") }} {{ product.name }} ? </template>
    <template #footer>
      <div class="grid grid-cols-3 gap-2">
        <Button class="col-span-2" @click="deleteTheProduct">
          {{ t("g.b.d") }}
        </Button>
        <Button variant="outline" @click="cancelDelete">
          {{ t("g.b.no") }}
        </Button>
      </div>
    </template>
  </UiModalCard>
</template>
