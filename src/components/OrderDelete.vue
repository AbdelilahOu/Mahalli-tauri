<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { useI18n } from "vue-i18n";
import { onBeforeUnmount } from "vue";
import { invoke } from "@tauri-apps/api";
import { Button } from "./ui/button";
import { store } from "@/store";
import UiModalCard from "./ui/UiModalCard.vue";

const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();

const deleteTheOrders = async (id: string) => {
  if (id) {
    try {
      await invoke("delete_order", { id });
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
      {{ t("o.d.title") }}n° {{ $route.query?.id }} ?
    </template>
    <template #footer>
      <div class="grid grid-cols-3 gap-2">
        <Button
          class="col-span-2"
          @click="deleteTheOrders($route.query?.id as string)"
        >
          {{ t("g.b.d") }}
        </Button>
        <Button variant="outline" @click="cancelDelete">
          {{ t("g.b.no") }}
        </Button>
      </div>
    </template>
  </UiModalCard>
</template>
