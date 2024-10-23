<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import * as Logger from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const props = defineProps<{
  id: string;
  fullName: string;
}>();
const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();
const { close } = useModal();

async function deleteTheClient() {
  try {
    await invoke<Res<any>>("delete_client", { id: props.id });
    // INFO
    Logger.info(`DELETE CLIENT: ${props.id}`);
    //
    toast.success(t("notifications.client.deleted", { name: props.fullName }), {
      closeButton: true,
    });
    // toggle refresh
    updateQueryParams({
      refresh: `refresh-delete-${Math.random() * 9999}`,
    });
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err === "object" && "error" in err) {
      Logger.error(`ERROR DELETE CLIENT: ${err.error}`);
      return;
    }
    Logger.error(`ERROR DELETE CLIENT: ${err}`);
  } finally {
    close();
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle> {{ t("titles.clients.delete") }} {{ fullName }} ? </CardTitle>
    </CardHeader>
    <CardContent>
      <div />
    </CardContent>
    <CardFooter>
      <Button variant="outline" @click="close">
        {{ t("buttons.cancel") }}
      </Button>
      <Button class="col-span-2" @click="deleteTheClient">
        {{ t("buttons.confirme") }}
      </Button>
    </CardFooter>
  </Card>
</template>
