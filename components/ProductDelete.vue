<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { error, info } from "tauri-plugin-log-api";
import type { Res } from "@/types";
import { toast } from "vue-sonner";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { t } = useI18n();

const deleteTheProduct = async (id: string, name: string) => {
  try {
    await invoke<Res<string>>("delete_product", { id });
    info(`DELETE PRODUCT: ${id}`);
    //
    toast.success(t("notifications.product.deleted", { name }), {
      closeButton: true,
    });
    // toggle refresh
    updateQueryParams({
      refresh: "refresh-delete-" + Math.random() * 9999,
    });
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    error("DELETE PRODUCT: " + err.error);
  } finally {
    cancelDelete();
  }
};

const cancelDelete = () => {
  store.setters.updateStore({ key: "show", value: false });
};
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle> {{ t("p.d.title") }} {{ $route.query.name }} ? </CardTitle>
    </CardHeader>
    <CardContent>
      <div />
    </CardContent>
    <CardFooter>
      <Button variant="outline" @click="cancelDelete">
        {{ t("g.b.no") }}
      </Button>
      <Button
        class="col-span-2"
        @click="
            () =>
              deleteTheProduct(
                $route.query.id as string,
                $route.query.name as string,
              )
          "
      >
        {{ t("g.b.d") }}
      </Button>
    </CardFooter>
  </Card>
</template>
