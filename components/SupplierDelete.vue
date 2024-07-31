<script setup lang="ts">
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import { toast } from "vue-sonner";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { close } = useModal();
const { t } = useI18n();

const props = defineProps<{
  id: string;
  fullname: string;
}>();

const deleteTheSupplier = async () => {
  try {
    await invoke<Res<string>>("delete_supplier", { id: props.id });
    //INFO
    console.info(`DELETE SUPPLIER: ${props.id}`);
    //
    toast.success(
      t("notifications.supplier.deleted", { name: props.fullname }),
      {
        closeButton: true,
      }
    );
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
      console.error("DELETE SUPPLIER: " + err.error);
      return;
    }
    console.error("DELETE SUPPLIER: " + err);
  } finally {
    close();
  }
};
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle> {{ t("s.d.title") }} {{ fullname }} ? </CardTitle>
    </CardHeader>
    <CardContent>
      <div />
    </CardContent>
    <CardFooter>
      <Button variant="outline" @click="close">
        {{ t("g.b.no") }}
      </Button>
      <Button class="col-span-2" @click="deleteTheSupplier">
        {{ t("g.b.d") }}
      </Button>
    </CardFooter>
  </Card>
</template>
