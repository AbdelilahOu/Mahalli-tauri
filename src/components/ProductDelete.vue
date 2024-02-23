<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { useI18n } from "vue-i18n";
import UiModalCard from "./ui/UiModalCard.vue";
import { invoke } from "@tauri-apps/api";
import { Button } from "./ui/button";
import { store } from "@/store";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { t } = useI18n();

const deleteTheProduct = async (id: string) => {
  try {
    await invoke("delete_product", { id });
    // toggle refresh
    updateQueryParams({
      refresh: "refresh-delete-" + Math.random() * 9999,
    });
  } catch (error) {
    console.log(error);
  } finally {
    cancelDelete();
  }
};

const cancelDelete = () => {
  store.setters.updateStore({ key: "show", value: false });
};
</script>

<template>
  <UiModalCard>
    <template #title> {{ t("p.d.title") }} {{ $route.query.name }} ? </template>
    <template #footer>
      <div class="grid grid-cols-3 gap-2">
        <Button
          class="col-span-2"
          @click="() => deleteTheProduct($route.query.id as string)"
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
