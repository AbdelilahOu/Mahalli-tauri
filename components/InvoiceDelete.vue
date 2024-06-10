<script setup lang="ts">
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import { error, info } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { t } = useI18n();

const deleteTheInvoice = async (id: string) => {
  try {
    await invoke<Res<any>>("delete_invoice", { id });
    //
    info(`DELETE INVOICE: ${id}`);
    //
    toast.success(t("notifications.invoice.deleted"), {
      closeButton: true,
    });
    // toggle refresh
    updateQueryParams({
      refresh: "refresh-delete-" + Math.random() * 9999,
    });
  } catch (err: any) {
    error("DELETE INVOICE: " + err.error);
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
      <CardTitle> {{ t("i.d.title") }} n° {{ $route.query.id }} ? </CardTitle>
    </CardHeader>
    <CardContent>
      <div></div>
    </CardContent>
    <CardFooter>
      <Button variant="outline" @click="cancelDelete">
        {{ t("g.b.no") }}
      </Button>
      <Button
        class="col-span-2"
        @click="deleteTheInvoice($route.query.id as string)"
      >
        {{ t("g.b.d") }}
      </Button>
    </CardFooter>
  </Card>
</template>
