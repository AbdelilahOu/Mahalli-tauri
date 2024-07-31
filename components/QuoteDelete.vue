<script setup lang="ts">
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import { toast } from "vue-sonner";

const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();
const { close } = useModal();

const props = defineProps<{
  id: string;
  identifier: string;
}>();

const deleteTheQuotes = async () => {
  try {
    await invoke<Res<any>>("delete_quote", { id: props.id });
    //INFO
    console.info(`DELETE QUOTE: ${props.id}`);
    //
    toast.success(t("notifications.quote.deleted"), {
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
      console.error("DELETE QUOTE: " + err.error);
      return;
    }
    console.error("DELETE QUOTE: " + err);
  } finally {
    close();
  }
};
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle> {{ t("q.d.title") }}n° {{ identifier }} ? </CardTitle>
    </CardHeader>
    <CardContent>
      <div />
    </CardContent>
    <CardFooter>
      <Button variant="outline" @click="close">
        {{ t("g.b.no") }}
      </Button>
      <Button class="col-span-2" @click="deleteTheQuotes">
        {{ t("g.b.d") }}
      </Button>
    </CardFooter>
  </Card>
</template>
