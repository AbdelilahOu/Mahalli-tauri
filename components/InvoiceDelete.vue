<script setup lang="ts">
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import { toast } from "vue-sonner";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { close } = useModal();
const { t } = useI18n();

const props = defineProps<{
  id: string;
  identifier: string;
}>();

const deleteTheInvoice = async () => {
  try {
    await invoke<Res<any>>("delete_invoice", { id: props.id });
    //INFO
    console.info(`DELETE INVOICE: ${props.id}`);
    //
    toast.success(t("notifications.invoice.deleted"), {
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
      console.error("DELETE INVOICE: " + err.error);
      return;
    }
    console.error("DELETE INVOICE: " + err);
  } finally {
    close();
  }
};
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle> {{ t("i.d.title") }} n° {{ identifier }} ? </CardTitle>
    </CardHeader>
    <CardContent>
      <div />
    </CardContent>
    <CardFooter>
      <Button variant="outline" @click="close">
        {{ t("g.b.no") }}
      </Button>
      <Button class="col-span-2" @click="deleteTheInvoice()">
        {{ t("g.b.d") }}
      </Button>
    </CardFooter>
  </Card>
</template>
