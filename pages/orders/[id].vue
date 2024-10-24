<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import * as Logger from "tauri-plugin-log-api";
import { toast } from "vue-sonner";
import { CLIENT_FIELDS, ORDER_STATUSES } from "~/consts";

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
  } catch (err: any) {
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
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err === "object" && "error" in err) {
      Logger.error(`ERROR ORDER DETAILS: ${err.error}`);
    }
  }
}

async function handleFileBytesUpload(bytes: Uint8Array, name: string) {
  config.template.bytes = bytes;
  config.template.name = name;
  handleGeneratePdf();
}

async function saveConfig() {
  try {
    if (config.template.bytes && config.template.name) {
      const filePath = await uploadFileToDataDir(
        "pdf-templates",
        config.template.bytes,
        config.template.name
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
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err === "object" && "error" in err) {
      Logger.error(`ERROR CREATE TEMPLATE: ${err.error}`);
    }
  }
}
handleGeneratePdf();
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
          @save-bytes="handleFileBytesUpload"
        />
        <Label>{{ t("fields.top-margin") }} </Label>
        <Input v-model="config.marginTop" />
        <Label> {{ t("fields.bottom-margin") }} </Label>
        <Input v-model="config.marginBottom" />
        <Separator class="my-2" />
        <div class="flex flex-col gap-2">
          <div class="flex justify-between items-center">
            <Label>{{ t("fields.status") }}</Label>
            <Switch
              :default-checked="config.fields.status"
              @update:checked="(checked) => (config.fields.status = checked)"
            />
          </div>
          <Select
            v-model="order.status"
            :disabled="!config.fields.status"
            :default-value="order.status"
          >
            <SelectTrigger>
              <SelectValue
                class="text-muted-foreground"
                :placeholder="t('select-status')"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="status in ORDER_STATUSES"
                  :key="status"
                  :value="status"
                >
                  {{ t(`status.${status.toLowerCase()}`) }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Separator class="my-2" />
        <div
          v-for="item in CLIENT_FIELDS"
          :key="item.field"
          class="flex flex-col gap-2"
        >
          <div class="flex justify-between items-center">
            <Label>
              {{ t(`fields.${item.label}`) }}
            </Label>
            <Switch
              :default-checked="config.fields[item.field]"
              @update:checked="
                (checked) => (config.fields[item.field] = checked)
              "
            />
          </div>
          <Input
            v-model="order.client[item.field]"
            :disabled="!config.fields[item.field]"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" @click="saveConfig">
          {{ t("buttons.save") }}
        </Button>
        <Button class="col-span-2" @click="handleGeneratePdf">
          {{ t("buttons.update") }}
        </Button>
      </CardFooter>
    </Card>
  </main>
</template>
