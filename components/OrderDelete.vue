<script setup lang="ts">
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import { error, info } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();

const deleteTheOrders = async (id: string) => {
  try {
    await invoke<Res<any>>("delete_order", { id });
    //
    info(`DELETE ORDER: ${id}`);
    //
    toast.success(t("notifications.order.deleted"), {
      closeButton: true,
    });
    // toggle refresh
    updateQueryParams({
      refresh: "refresh-delete-" + Math.random() * 9999,
    });
  } catch (err: any) {
    error("DELETE ORDER: " + err);
  } finally {
    store.setters.updateStore({ key: "show", value: false });
  }
};

const cancelDelete = () => {
  store.setters.updateStore({ key: "show", value: false });
};
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle> {{ t("o.d.title") }}n° {{ $route.query?.id }} ? </CardTitle>
    </CardHeader>
    <CardFooter>
      <Button variant="outline" @click="cancelDelete">
        {{ t("g.b.no") }}
      </Button>
      <Button
        class="col-span-2"
        @click="deleteTheOrders($route.query?.id as string)"
      >
        {{ t("g.b.d") }}
      </Button>
    </CardFooter>
  </Card>
</template>
