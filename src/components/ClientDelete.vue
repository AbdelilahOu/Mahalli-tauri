<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { useI18n } from "vue-i18n";
import { computed, onBeforeUnmount } from "vue";
import UiModalCard from "./ui/UiModalCard.vue";
import { invoke } from "@tauri-apps/api";
import { Button } from "./ui/button";
import { store } from "@/store";
import type { ClientT } from "@/schemas/client.schema";

const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();
const client = computed(() => store.getters.getSelectedRow<ClientT>());

const deleteTheClient = async () => {
  const id = client.value?.id;
  if (id) {
    try {
      await invoke("delete_client", { id });
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

onBeforeUnmount(() => store.setters.updateStore({ key: "row", value: null }));
</script>
<template>
  <UiModalCard>
    <template #title> {{ t("c.d.title") }} {{ client.fullname }} ? </template>
    <template #footer>
      <div class="grid grid-cols-3 gap-2">
        <Button class="col-span-2" @click="deleteTheClient">
          {{ t("g.b.d") }}
        </Button>
        <Button variant="outline" @click="cancelDelete">
          {{ t("g.b.no") }}
        </Button>
      </div>
    </template>
  </UiModalCard>
</template>
