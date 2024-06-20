<script setup lang="ts">
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import { error, info } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();
const { toggleModal } = useStore();

const deleteTheClient = async (id: string, fullname: string) => {
  try {
    await invoke<Res<any>>("delete_client", { id });
    //
    info(`DELETE CLIENT: ${id}`);
    //
    toast.success(t("notifications.client.deleted", { name: fullname }), {
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
    error("DELETE CLIENT: " + err.error);
  } finally {
    cancelDelete();
  }
};

const cancelDelete = () => {
  toggleModal(false);
};
</script>
<template>
  <Card>
    <CardHeader>
      <CardTitle>
        {{ t("c.d.title") }} {{ $route.query.fullname }} ?
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
              deleteTheClient(
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
