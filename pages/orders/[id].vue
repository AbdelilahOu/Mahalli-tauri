<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { error } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const { t } = useI18n();
const id = useRoute().params.id;
const pdfContent = ref("");

const { config, setDocumentTemplate, generatePdf } = usePdfGenerator();

const { data: order } = await useAsyncData("get_order_details", async () => {
  try {
    const res = await invoke<Res<any>>("get_order_details", {
      id,
    });
    return res.data;
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err === "object" && "error" in err) {
      error(`ERROR ORDER DETAILS: ${err.error}`);
    }
  }
});

async function handleGeneratePdf() {
  try {
    const pdfDataUri = await generatePdf(order.value, "order");
    if (pdfDataUri) {
      pdfContent.value = pdfDataUri;
    }
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err === "object" && "error" in err) {
      error(`ERROR ORDER DETAILS: ${err.error}`);
    }
  }
}

handleGeneratePdf();

watch(
  () => config.templateBase64,
  () => {
    handleGeneratePdf();
  }
);
</script>

<template>
  <main class="w-full h-full flex gap-2 min-h-[calc(100vh-68px)]">
    <PdfViewer :pdf-content="pdfContent" />
    <Card class="w-1/2 md:w-1/3 min-w-[500px] flex flex-col">
      <CardHeader>
        <CardTitle> {{ t("fields.configuration") }} </CardTitle>
      </CardHeader>
      <CardContent class="flex-1">
        <Label> {{ t("fields.template") }} </Label>
        <UiUploader
          name="Pdf"
          :extensions="['pdf']"
          @save-base64="setDocumentTemplate"
        />
        <Label>{{ t("fields.top-margin") }} </Label>
        <Input v-model="config.marginTop" />
        <Label> {{ t("fields.bottom-margin") }} </Label>
        <Input v-model="config.marginBottom" />
        <Separator class="my-2" />
        <div class="flex flex-col gap-2">
          <div class="flex justify-between items-center">
            <Label>
              {{ t("fields.full-name") }}
            </Label>
            <Switch
              :default-checked="config.clientFields.full_name"
              @update:checked="
                (checked) => (config.clientFields.full_name = checked)
              "
            />
          </div>
          <Input
            v-model="order.client.full_name"
            :disabled="!config.clientFields.full_name"
          />
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex justify-between items-center">
            <Label>{{ t("fields.address") }}</Label>
            <Switch
              :default-checked="config.clientFields.address"
              @update:checked="
                (checked) => (config.clientFields.address = checked)
              "
            />
          </div>
          <Input
            v-model="order.client.address"
            :disabled="!config.clientFields.address"
          />
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex justify-between items-center">
            <Label>{{ t("fields.email") }}</Label>
            <Switch
              :default-checked="config.clientFields.email"
              @update:checked="
                (checked) => (config.clientFields.email = checked)
              "
            />
          </div>
          <Input
            v-model="order.client.email"
            :disabled="!config.clientFields.email"
          />
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex justify-between items-center">
            <Label>{{ t("fields.phone") }}</Label>
            <Switch
              :default-checked="config.clientFields.phone_number"
              @update:checked="
                (checked) => (config.clientFields.phone_number = checked)
              "
            />
          </div>
          <Input
            v-model="order.client.phone_number"
            :disabled="!config.clientFields.phone_number"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button class="col-span-3" @click="handleGeneratePdf">
          {{ t("buttons.save") }}
        </Button>
      </CardFooter>
    </Card>
  </main>
</template>
