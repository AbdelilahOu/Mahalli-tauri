<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { error } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";
import { ORDER_STATUSES } from "~/consts/status";

const { t } = useI18n();
const id = useRoute().params.id;
const pdfContent = ref("");

const clientFields = [
  {
    label: "full-name",
    field: "full_name",
  },
  {
    label: "email",
    field: "email",
  },
  {
    label: "phone",
    field: "phone_number",
  },
  {
    label: "address",
    field: "address",
  },
];

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
            <Label>{{ t("fields.status") }}</Label>
            <Switch
              :default-checked="config.fields.status"
              @update:checked="(checked) => (config.fields.status = checked)"
            />
          </div>
          <Select
            :disabled="!config.fields.status"
            v-model="order.status"
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
        <div v-for="item in clientFields" class="flex flex-col gap-2">
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
        <Button class="col-span-3" @click="handleGeneratePdf">
          {{ t("buttons.save") }}
        </Button>
      </CardFooter>
    </Card>
  </main>
</template>
