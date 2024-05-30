<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { useI18n } from "vue-i18n";
import UiModalCard from "./ui/UiModalCard.vue";
import { invoke } from "@tauri-apps/api";
import { Button } from "./ui/button";
import { store } from "@/store";
import { error, info } from "tauri-plugin-log-api";
import type { Res } from "@/types";
import { toast } from "vue-sonner";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { t } = useI18n();

const deleteTheSupplier = async (id: string, name: string) => {
  try {
    await invoke<Res<string>>("delete_supplier", { id });
    //
    info(`DELETE SUPPLIER: ${id}`);
    //
    toast.success(t("notifications.supplier.deleted", { name }), {
      closeButton: true,
    });
    // toggle refresh
    updateQueryParams({
      refresh: "refresh-delete-" + Math.random() * 9999,
    });
  } catch (err: any) {
    error("DELETE SUPPLIER: " + err);
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
      {{ t("s.d.title") }} {{ $route.query.fullname }} ?
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
              deleteTheSupplier(
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
