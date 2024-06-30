<script setup lang="ts">
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import { error, info } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { toggleModal } = useStore();
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
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err == "object" && "error" in err) {
      error("DELETE SUPPLIER: " + err.error);
      return;
    }
    error("DELETE SUPPLIER: " + err);
  } finally {
    cancelDelete();
  }
};

const cancelDelete = () => toggleModal(false);
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>
        {{ t("s.d.title") }} {{ $route.query.fullname }} ?
      </CardTitle>
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
              deleteTheSupplier(
                $route.query.id as string,
                $route.query.fullname as string,
              )
          "
      >
        {{ t("g.b.d") }}
      </Button>
    </CardFooter>
  </Card>
</template>
