<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { useI18n } from "vue-i18n";
import { invoke } from "@tauri-apps/api";
import { Button } from "./ui/button";
import { store } from "@/store";
import UiModalCard from "./ui/UiModalCard.vue";
import { error, info } from "tauri-plugin-log-api";
import type { Res } from "@/types";
import { toast } from "vue-sonner";

const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();

const deleteTheQuotes = async (id: string) => {
  try {
    await invoke<Res<any>>("delete_quote", { id });
    //
    info(`DELETE QUOTE: ${id}`);
    //
    toast(t("notifications.quote.deleted"), {
      closeButton: true,
    });
    // toggle refresh
    updateQueryParams({
      refresh: "refresh-delete-" + Math.random() * 9999,
    });
  } catch (err: any) {
    error("DELETE QUOTE: " + err);
  } finally {
    store.setters.updateStore({ key: "show", value: false });
  }
};

const cancelDelete = () => {
  store.setters.updateStore({ key: "show", value: false });
};
</script>

<template>
  <UiModalCard>
    <template #title>
      {{ t("q.d.title") }}n° {{ $route.query?.id }} ?
    </template>
    <template #footer>
      <div class="grid grid-cols-3 gap-2">
        <Button variant="outline" @click="cancelDelete">
          {{ t("g.b.no") }}
        </Button>
        <Button
          class="col-span-2"
          @click="deleteTheQuotes($route.query?.id as string)"
        >
          {{ t("g.b.d") }}
        </Button>
      </div>
    </template>
  </UiModalCard>
</template>
