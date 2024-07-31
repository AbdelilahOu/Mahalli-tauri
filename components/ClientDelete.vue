<script setup lang="ts">
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import { toast } from "vue-sonner";

const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();
const { close } = useModal();

const props = defineProps<{
  id: string;
  fullname: string;
}>();

const deleteTheClient = async () => {
  try {
    await invoke<Res<any>>("delete_client", { id: props.id });
    //INFO
    console.info(`DELETE CLIENT: ${props.id}`);
    //
    toast.success(t("notifications.client.deleted", { name: props.fullname }), {
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
      console.error("DELETE CLIENT: " + err.error);
      return;
    }
    console.error("DELETE CLIENT: " + err);
  } finally {
    close();
  }
};
</script>
<template>
  <Card>
    <CardHeader>
      <CardTitle> {{ t("c.d.title") }} {{ fullname }} ? </CardTitle>
    </CardHeader>
    <CardContent>
      <div />
    </CardContent>
    <CardFooter>
      <Button variant="outline" @click="close">
        {{ t("g.b.no") }}
      </Button>
      <Button class="col-span-2" @click="deleteTheClient">
        {{ t("g.b.d") }}
      </Button>
    </CardFooter>
  </Card>
</template>
