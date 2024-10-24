<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import * as Logger from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const { t } = useI18n();
const id = useRoute().params.id;
const pdfContent = ref("");

const { config, generatePdf } = usePdfGenerator();

const { data: quote } = await useAsyncData(async () => {
  try {
    const res = await invoke<Res<any>>("get_quote_details", {
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
      Logger.error(`ERROR QUOTE DETAILS: ${err.error}`);
    }
  }
});

async function handleGeneratePdf() {
  try {
    const pdfDataUri = await generatePdf(quote.value, "quote");
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
      Logger.error(`ERROR QUOTE DETAILS: ${err.error}`);
    }
  }
}

async function saveConfig() {
  try {
    if (config.template.bytes && config.template.name) {
      const filePath = await uploadFileToDataDir(
        "pdf-templates",
        config.template.bytes,
        config.template.name,
      );
      config.template.path = filePath;
    }
    await invoke("create_template", {
      template: {
        values_json: JSON.stringify({
          ...config,
          template: {
            path: config.template.path,
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
  quote.value.client = configAndValues.documentValues.client;
  config.fields = configAndValues.fields;
  config.marginBottom = configAndValues.marginBottom;
  config.marginTop = configAndValues.marginTop;
  config.template = configAndValues.template;

  handleGeneratePdf();
}

handleGeneratePdf();
</script>

<template>
  <main class="w-full h-full flex gap-2 min-h-[calc(100vh-68px)]">
    <PdfViewer :pdf-content="pdfContent" />
    <TemplateForm
      :config="config"
      :document="quote"
      @update-config="updateConfig"
      @save-config="saveConfig"
    />
  </main>
</template>
