<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import * as Logger from "tauri-plugin-log-api";
import { toast } from "vue-sonner";
import { ORDER_STATUSES } from "~/consts";

const { t } = useI18n();
const id = useRoute().params.id;
const pdfContent = ref("");

const { config, generatePdf } = usePdfGenerator();

const { data: order } = await useAsyncData(async () => {
  try {
    const res = await invoke<Res<any>>("get_order_details", {
      id,
    });
    return res.data;
  }
  catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err === "object" && "error" in err) {
      Logger.error(`ERROR ORDER DETAILS: ${err.error}`);
    }
  }
});

async function handleGeneratePdf() {
  try {
    const pdfDataUri = await generatePdf(order.value, "order");
    if (pdfDataUri) {
      pdfContent.value = pdfDataUri;
    }
  }
  catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err === "object" && "error" in err) {
      Logger.error(`ERROR ORDER DETAILS: ${err.error}`);
    }
  }
}

async function saveConfig() {
  try {
    let filePath: string | null = null;
    if (config.template.bytes && config.template.name) {
      filePath = await uploadFileToDataDir(
        "pdf-templates",
        config.template.bytes,
        config.template.name,
      );
    }
    await invoke("create_template", {
      template: {
        values_json: JSON.stringify({
          ...config,
          template: {
            path: filePath,
            name: config.template.name,
          },
        }),
      },
    });
    toast(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
  }
  catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err === "object" && "error" in err) {
      Logger.error(`ERROR CREATE TEMPLATE: ${err.error}`);
    }
  }
}

async function updateConfig(configAndValues: any) {
  const { documentValues, ...configValues } = configAndValues;
  order.value = { ...order.value, ...documentValues };

  config.fields = configValues.fields;
  config.marginBottom = configValues.marginBottom;
  config.marginTop = configValues.marginTop;
  config.template = configValues.template;

  handleGeneratePdf();
}

handleGeneratePdf();
</script>

<template>
  <main class="w-full h-full flex gap-2 min-h-[calc(100vh-68px)]">
    <PdfViewer :pdf-content="pdfContent" />
    <TemplateForm
      :config="config"
      :document="order"
      :statues="ORDER_STATUSES"
      @update-config="updateConfig"
      @save-config="saveConfig"
    />
  </main>
</template>
