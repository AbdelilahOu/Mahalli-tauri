<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { store } from "@/store";
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import { error, info } from "tauri-plugin-log-api";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";
import UiModalCard from "./ui/UiModalCard.vue";
import { Button } from "./ui/button";

const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();

const deleteTheClient = async (id: string, fullname: string) => {
  try {
    await invoke<Res<any>>("delete_client", { id });
    //
    info(`DELETE CLIENT: ${id}`);
    //
    toast(t("notifications.client.deleted", { name: fullname }), {
      closeButton: true,
    });
    // toggle refresh
    updateQueryParams({
      refresh: "refresh-delete-" + Math.random() * 9999,
    });
  } catch (err: any) {
    error("DELETE CLIENT: " + err);
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
    <template #title>
      {{ t("c.d.title") }} {{ $route.query.fullname }} ?
    </template>
    <template #footer>
      <div class="grid grid-cols-3 gap-2">
        <Button variant="outline" @click="cancelDelete">
          {{ t("g.b.no") }}
        </Button>
        <Button
          class="col-span-2"
          @click="
            () =>
              deleteTheClient(
                $route.query.id as string,
                $route.query.fullname as string,
              )
          "
        >
          {{ t("g.b.d") }}
        </Button>
      </div>
    </template>
  </UiModalCard>
</template>
