<script setup lang="ts">
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import { error, info } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();

const deleteTheQuotes = async (id: string) => {
  try {
    await invoke<Res<any>>("delete_quote", { id });
    //
    info(`DELETE QUOTE: ${id}`);
    //
    toast.success(t("notifications.quote.deleted"), {
      closeButton: true,
    });
    // toggle refresh
    updateQueryParams({
      refresh: "refresh-delete-" + Math.random() * 9999,
    });
  } catch (err: any) {
    error("DELETE QUOTE: " + err.error);
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
      <CardTitle> {{ t("q.d.title") }}n° {{ $route.query?.id }} ? </CardTitle>
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
        @click="deleteTheQuotes($route.query?.id as string)"
      >
        {{ t("g.b.d") }}
      </Button>
    </CardFooter>
  </Card>
</template>
