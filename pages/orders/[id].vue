<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { error } from "tauri-plugin-log-api";
import { PDFDocument, PDFName, PDFPage, PageSizes, rgb } from "pdf-lib";
import type { PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { toast } from "vue-sonner";
import CairoRegular from "@/assets/fonts/Cairo-Regular.ttf";

const { t, locale, n } = useI18n();
const { numberToText } = useNumberToText();
const id = useRoute().params.id;
const order = ref({
  id: "",
  identifier: "",
  total: 0,
  createdAt: "",
  client: {
    fullName: "",
    address: "",
    email: "",
    phoneNumber: "",
  },
  items: [],
});
const pdfRef = ref<HTMLIFrameElement | null>();
// pdf layout setting
const config = reactive({
  marginTop: 40,
  marginX: 20,
  marginBottom: 90,
  templateBase64: null as string | null,
  color: rgb(0.34, 0.34, 0.34),
  clientFields: {
    fullname: true,
    email: true,
    address: true,
    phone: true,
  },
});
//
let resolveWaitForFetch: (value?: unknown) => void;
const waitForFetch = new Promise((r) => (resolveWaitForFetch = r));
let pdfDoc: PDFDocument;
let font: PDFFont;

function setDocumentTemplate(data: string) {
  config.templateBase64 = data;
}

onBeforeMount(async () => {
  try {
    const res = await invoke<Res<any>>("get_order_details", {
      id,
    });
    order.value = res.data;
    resolveWaitForFetch();
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

onMounted(async () => {
  try {
    await waitForFetch;
    initPdfDoc();
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    error(`ERROR PDF-LIB: ${err}`);
  }
});

watch(
  () => config.templateBase64,
  () => {
    initPdfDoc();
  }
);

async function initPdfDoc() {
  try {
    pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const res = await fetch(CairoRegular);
    const fontBytes = await res.arrayBuffer();
    font = await pdfDoc.embedFont(fontBytes);
    generatePdf();
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    error(`ERROR PDF-LIB: ${err}`);
  }
}

async function generatePdf() {
  try {
    let page: PDFPage;
    let Tempalte: PDFPage | undefined;
    if (config.templateBase64) {
      const sourcePdfDoc = await PDFDocument.load(
        `data:application/pdf;base64,${config.templateBase64}`
      );
      const [template] = await pdfDoc.copyPages(sourcePdfDoc, [0]);
      Tempalte = template;
      page = pdfDoc.addPage(copyPage(Tempalte));
    } else {
      page = pdfDoc.addPage();
    }
    page.setSize(...PageSizes.A4);
    const { width, height } = page.getSize();

    drawHeader(page, width, height, order.value);

    page.drawLine({
      start: { x: config.marginX, y: height - config.marginTop - 20 * 7 + 10 },
      end: {
        x: width - config.marginX,
        y: height - config.marginTop - 20 * 7 + 10,
      },
      thickness: 1,
      color: config.color,
      opacity: 0.75,
    });

    const items = [...order.value.items];
    drawItems(page, width, items, height - config.marginTop - 20 * 7, Tempalte);

    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    pdfRef.value?.setAttribute("src", pdfDataUri);
  } catch (err) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    error(`ERROR PDF-LIB: ${err}`);
  }
}

function drawHeader(page: PDFPage, width: number, height: number, order: any) {
  let OrderText = "";
  switch (locale.value) {
    case "en":
      OrderText = "O R D E R";
      break;
    case "fr":
      OrderText = "C O M M A N D E";
      break;
    case "de":
      OrderText = "A U F T R A G";
      break;
    case "ar":
      OrderText = "طلب";
      break;
  }
  let OrderDetailsX = 0;
  switch (locale.value) {
    case "en":
    case "fr":
    case "de":
      OrderDetailsX =
        width - font.widthOfTextAtSize(OrderText, 30) - config.marginX;
      break;
    case "ar":
      OrderDetailsX =
        width - font.widthOfTextAtSize(order.identifier, 13) - config.marginX;
      break;
  }
  page.drawText(OrderText, {
    x: OrderDetailsX,
    y: height - config.marginTop,
    font,
    size: 30,
    color: config.color,
  });
  page.drawText(order.identifier, {
    x: OrderDetailsX,
    y: height - config.marginTop - 20,
    font,
    size: 13,
    color: config.color,
  });
  page.drawText(order.createdAt.split(" ")[0], {
    x: OrderDetailsX,
    y: height - config.marginTop - 40,
    font,
    size: 13,
    color: config.color,
  });
  page.drawText(t(`status.${order.status.toLowerCase()}`), {
    x: OrderDetailsX,
    y: height - config.marginTop - 60,
    font,
    size: 13,
    color: config.color,
  });
  //
  page.drawText(t("fields.bill-to").toUpperCase(), {
    x: config.marginX,
    y: height - config.marginTop,
    font,
    size: 14,
    color: config.color,
  });
  let clientFields: string[] = [];
  if (config.clientFields.fullname) {
    clientFields.push(order.client.fullName);
  }
  if (config.clientFields.email) {
    clientFields.push(order.client.email);
  }
  if (config.clientFields.phone) {
    clientFields.push(order.client.phoneNumber);
  }
  if (config.clientFields.address) {
    clientFields.push(order.client.address);
  }

  for (let i = 0; i < clientFields.length; i++) {
    page.drawText(clientFields[i], {
      x: config.marginX,
      y: height - config.marginTop - 20 * (i + 1),
      font,
      size: 13,
      color: config.color,
    });
  }

  //
  page.drawLine({
    start: { x: config.marginX, y: height - config.marginTop - 20 * 5 },
    end: { x: width - config.marginX, y: height - config.marginTop - 20 * 5 },
    thickness: 1,
    color: config.color,
    opacity: 0.75,
  });
  page.drawText(t("fields.name"), {
    x: config.marginX + 5,
    y: height - config.marginTop - 20 * 6,
    font,
    size: 14,
    color: config.color,
  });
  page.drawText(t("fields.quantity"), {
    x: config.marginX + 5 + width / 4,
    y: height - config.marginTop - 20 * 6,
    font,
    size: 14,
    color: config.color,
  });

  page.drawText(t("fields.price"), {
    x: config.marginX + 5 + width / 2,
    y: height - config.marginTop - 20 * 6,
    font,
    size: 14,
    color: config.color,
  });

  page.drawText(t("fields.total"), {
    x: config.marginX + 5 + (width * 3) / 4,
    y: height - config.marginTop - 20 * 6,
    font,
    size: 14,
    color: config.color,
  });
}

function drawItems(
  page: PDFPage,
  width: number,
  items: any[],
  currentY: number,
  template?: PDFPage
) {
  if (items.length === 0) {
    drawSummary(page, width, currentY);
    return;
  }

  const item = items.shift();
  page.drawText(item.name, {
    x: config.marginX + 5,
    y: currentY - 10,
    font,
    size: 12,
    color: config.color,
  });
  page.drawText(n(item.quantity, "decimal"), {
    x: config.marginX + 5 + width / 4,
    y: currentY - 10,
    font,
    size: 12,
    color: config.color,
  });
  page.drawText(n(item.price, "currency"), {
    x: config.marginX + 5 + width / 2,
    y: currentY - 10,
    font,
    size: 12,
    color: config.color,
  });
  page.drawText(n(item.price * item.quantity, "currency"), {
    x: config.marginX + 5 + (width * 3) / 4,
    y: currentY - 10,
    font,
    size: 12,
    color: config.color,
  });
  page.drawLine({
    start: { x: config.marginX, y: currentY - 20 },
    end: {
      x: width - config.marginX,
      y: currentY - 20,
    },
    thickness: 1,
    color: config.color,
    opacity: 0.75,
  });

  const lineHeight = 30;
  if (currentY < config.marginBottom) {
    let newPage: PDFPage;
    if (template) {
      newPage = pdfDoc.addPage(copyPage(template));
    } else {
      newPage = pdfDoc.addPage();
    }
    newPage.setSize(...PageSizes.A4);
    drawItems(
      newPage,
      width,
      items,
      newPage.getHeight() - config.marginTop,
      template
    );
  } else {
    drawItems(page, width, items, currentY - lineHeight, template);
  }
}

function drawSummary(page: PDFPage, width: number, currentY: number) {
  let SummaryX = 0;
  switch (locale.value) {
    case "en":
    case "fr":
      SummaryX = width - width / 2 + 60;
      break;
    case "de":
      SummaryX = width - width / 2 - 20;
      break;
    case "ar":
      SummaryX = width - width / 2 + 30;
      break;
  }

  page.drawText(n(order.value.total, "currency"), {
    x: config.marginX + 5 + (width * 3) / 4,
    y: currentY - 10,
    font,
    size: 12,
    color: config.color,
  });

  page.drawText(t("fields.sub-total").toUpperCase(), {
    x: SummaryX,
    y: currentY - 10,
    font,
    size: 12,
    color: config.color,
  });
  page.drawLine({
    start: {
      x: SummaryX,
      y: currentY - 20,
    },
    end: {
      x: width - config.marginX,
      y: currentY - 20,
    },
    thickness: 1,
    color: config.color,
    opacity: 0.75,
  });

  page.drawText("20%", {
    x: config.marginX + 5 + (width * 3) / 4,
    y: currentY - 40,
    font,
    size: 12,
    color: config.color,
  });

  page.drawText(t("fields.vat-rate").toUpperCase(), {
    x: SummaryX,
    y: currentY - 40,
    font,
    size: 12,
    color: config.color,
  });

  page.drawLine({
    start: {
      x: SummaryX,
      y: currentY - 50,
    },
    end: {
      x: width - config.marginX,
      y: currentY - 50,
    },
    thickness: 1,
    color: config.color,
    opacity: 0.75,
  });

  page.drawText(n(order.value.total * 0.2, "currency"), {
    x: config.marginX + 5 + (width * 3) / 4,
    y: currentY - 70,
    font,
    size: 12,
    color: config.color,
  });

  page.drawText(t("fields.vat-amount").toUpperCase(), {
    x: SummaryX,
    y: currentY - 70,
    font,
    size: 12,
    color: config.color,
  });

  page.drawLine({
    start: {
      x: SummaryX,
      y: currentY - 80,
    },
    end: {
      x: width - config.marginX,
      y: currentY - 80,
    },
    thickness: 1,
    color: config.color,
    opacity: 0.75,
  });

  page.drawText(n(order.value.total + order.value.total * 0.2, "currency"), {
    x: config.marginX + 5 + (width * 3) / 4,
    y: currentY - 100,
    font,
    size: 12,
    color: config.color,
  });

  page.drawText(t("fields.grand-total").toUpperCase(), {
    x: SummaryX,
    y: currentY - 100,
    font,
    size: 12,
    color: config.color,
  });

  page.drawLine({
    start: {
      x: SummaryX,
      y: currentY - 110,
    },
    end: {
      x: width - config.marginX,
      y: currentY - 110,
    },
    thickness: 1,
    color: config.color,
    opacity: 0.75,
  });

  const totalAsText = numberToText(
    order.value.total + order.value.total * 0.2,
    locale.value as any
  );
  page.drawText(totalAsText, {
    x: (width - config.marginX - font.widthOfTextAtSize(totalAsText, 13)) / 2,
    y: currentY - 130,
    font,
    size: 13,
    color: config.color,
  });
}

function copyPage(originalPage: any) {
  const cloneNode = originalPage.node.clone();

  const { Contents } = originalPage.node.normalizedEntries();
  if (Contents) cloneNode.set(PDFName.of("Contents"), Contents.clone());

  const cloneRef = originalPage.doc.context.register(cloneNode);
  const clonePage = PDFPage.of(cloneNode, cloneRef, originalPage.doc);
  return clonePage;
}
</script>

<template>
  <main class="w-full h-full flex gap-2 min-h-[calc(100vh-68px)]">
    <iframe ref="pdfRef" class="flex-1" />
    <Card class="w-1/2 md:w-1/3 min-w-[500px] flex flex-col">
      <CardHeader>
        <CardTitle> {{ t("fields.configuration") }} </CardTitle>
      </CardHeader>
      <CardContent class="flex-1">
        <Label> {{ t("fields.template") }} </Label>
        <UiUploader
          name="Pdf"
          :extensions="['pdf']"
          @save:base64="setDocumentTemplate"
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
              :default-checked="config.clientFields.fullname"
              @update:checked="
                (checked) => (config.clientFields.fullname = checked)
              "
            />
          </div>
          <Input
            v-model="order.client.fullName"
            :disabled="!config.clientFields.fullname"
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
              :default-checked="config.clientFields.phone"
              @update:checked="
                (checked) => (config.clientFields.phone = checked)
              "
            />
          </div>
          <Input
            v-model="order.client.phoneNumber"
            :disabled="!config.clientFields.phone"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button class="col-span-3" @click="initPdfDoc">
          {{ t("buttons.save") }}
        </Button>
      </CardFooter>
    </Card>
  </main>
</template>
