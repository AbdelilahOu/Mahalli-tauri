<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { error } from "tauri-plugin-log-api";
import type { Res } from "@/types";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  PageSizes,
  PDFName,
  PDFPage,
} from "pdf-lib";
import type { RGB, PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import CairoRegular from "@/assets/fonts/Cairo-Regular.ttf";
import { toast } from "vue-sonner";

const { t, locale } = useI18n();
const id = useRoute().params.id;
const order = ref<any | null>(null);
const pdfRef = ref<HTMLIFrameElement | null>();
// pdf layout setting
const marginTop = ref(120);
const marginX = ref(20);
const marginBottom = ref(20);
const templateBase64 = ref<string>();
//
let resolveWaitForFetch: (value?: unknown) => void;
const waitForFetch = new Promise((r) => (resolveWaitForFetch = r));
let pdfDoc: PDFDocument;
let font: PDFFont;
let color: RGB;

const setDocumentTemplate = (data: string) => {
  templateBase64.value = data;
  initPdfDoc();
};

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
    if ("error" in err) {
      error("ERROR ORDER DETAILS: " + err.error);
      return;
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
    error("ERROR PDF-LIB: " + err);
  }
});

const initPdfDoc = async () => {
  marginTop.value = !templateBase64.value ? 40 : 130;
  pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  if (locale.value == "ar") {
    const res = await fetch(CairoRegular);
    const fontBytes = await res.arrayBuffer();
    font = await pdfDoc.embedFont(fontBytes);
  } else {
    font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  }
  color = rgb(0.34, 0.34, 0.34);
  generatePdf();
};

const generatePdf = async () => {
  try {
    let page: PDFPage;
    let Tempalte: PDFPage | undefined;
    if (templateBase64.value) {
      const sourcePdfDoc = await PDFDocument.load(
        "data:application/pdf;base64," + templateBase64.value
      );
      const [template] = await pdfDoc.copyPages(sourcePdfDoc, [0]);
      Tempalte = template;
      page = pdfDoc.addPage(copyPage(Tempalte));
    } else {
      page = pdfDoc.addPage();
    }
    page.setSize(...PageSizes.A4);
    const { width, height } = page.getSize();

    drawOrderHeader(page, width, height, order.value);

    page.drawLine({
      start: { x: marginX.value, y: height - marginTop.value - 20 * 7 + 10 },
      end: {
        x: width - marginX.value,
        y: height - marginTop.value - 20 * 7 + 10,
      },
      thickness: 1,
      color,
      opacity: 0.75,
    });

    const items = [...order.value.items];
    drawOrderItems(
      page,
      width,
      items,
      height - marginTop.value - 20 * 7,
      Tempalte
    );

    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    pdfRef.value?.setAttribute("src", pdfDataUri);
  } catch (error) {
    console.log(error);
  }
};

const drawOrderHeader = (
  page: PDFPage,
  width: number,
  height: number,
  order: any
) => {
  page.drawText("O R D E R", {
    x: width - 190,
    y: height - marginTop.value,
    font,
    size: 30,
    color,
  });
  page.drawText(order.createdAt.split(" ")[0], {
    x: width - 190,
    y: height - marginTop.value - 20,
    font,
    size: 13,
    color,
  });
  page.drawText(t("g.status." + order.status.toLowerCase()), {
    x: width - 190,
    y: height - marginTop.value - 40,
    font,
    size: 13,
    color,
  });
  //
  page.drawText(t("i.u.d.c.title").toUpperCase(), {
    x: marginX.value,
    y: height - marginTop.value,
    font,
    size: 14,
    color,
  });
  page.drawText(order.client.fullname, {
    x: marginX.value,
    y: height - marginTop.value - 20,
    font,
    size: 13,
    color,
  });
  page.drawText(order.client.address, {
    x: marginX.value,
    y: height - marginTop.value - 20 * 2,
    font,
    size: 13,
    color,
  });
  page.drawText(order.client.phoneNumber, {
    x: marginX.value,
    y: height - marginTop.value - 20 * 3,
    font,
    size: 13,
    color,
  });
  page.drawText(order.client.email, {
    x: marginX.value,
    y: height - marginTop.value - 20 * 4,
    font,
    size: 13,
    color,
  });
  //
  page.drawLine({
    start: { x: marginX.value, y: height - marginTop.value - 20 * 5 },
    end: { x: width - marginX.value, y: height - marginTop.value - 20 * 5 },
    thickness: 1,
    color,
    opacity: 0.75,
  });
  page.drawText(t("g.fields.name"), {
    x: 25,
    y: height - marginTop.value - 20 * 6,
    font,
    size: 14,
    color,
  });
  page.drawText(t("g.fields.price"), {
    x: 25 + width / 4,
    y: height - marginTop.value - 20 * 6,
    font,
    size: 14,
    color,
  });

  page.drawText(t("g.fields.quantity"), {
    x: 25 + width / 2,
    y: height - marginTop.value - 20 * 6,
    font,
    size: 14,
    color,
  });

  page.drawText(t("g.fields.total"), {
    x: 25 + (width * 3) / 4,
    y: height - marginTop.value - 20 * 6,
    font,
    size: 14,
    color,
  });
};

const drawOrderItems = (
  page: PDFPage,
  width: number,
  items: any[],
  currentY: number,
  template?: PDFPage
) => {
  if (items.length === 0) {
    drawSummary(page, width, currentY);
    return;
  }

  const item = items.shift();
  page.drawText(item.name, {
    x: 25,
    y: currentY - 10,
    font,
    size: 12,
    color,
  });
  page.drawText("DH " + item.price.toFixed(2), {
    x: 25 + width / 4,
    y: currentY - 10,
    font,
    size: 12,
    color,
  });
  page.drawText(item.quantity.toFixed(0), {
    x: 25 + width / 2,
    y: currentY - 10,
    font,
    size: 12,
    color,
  });
  page.drawText("DH " + (item.price * item.quantity).toFixed(2), {
    x: 25 + (width * 3) / 4,
    y: currentY - 10,
    font,
    size: 12,
    color,
  });
  page.drawLine({
    start: { x: marginX.value, y: currentY - 20 },
    end: {
      x: width - marginX.value,
      y: currentY - 20,
    },
    thickness: 1,
    color,
    opacity: 0.75,
  });

  const lineHeight = 30; // Assuming a line height for each item
  const remainingHeight = currentY - lineHeight;
  if (remainingHeight < marginBottom.value + lineHeight + 30) {
    let newPage: PDFPage;
    if (template) {
      newPage = pdfDoc.addPage(copyPage(template));
    } else {
      newPage = pdfDoc.addPage();
    }
    newPage.setSize(...PageSizes.A4);
    drawOrderItems(
      newPage,
      width,
      items,
      newPage.getHeight() - marginTop.value,
      template
    );
  } else {
    drawOrderItems(page, width, items, currentY - lineHeight, template);
  }
};

const drawSummary = (page: PDFPage, width: number, currentY: number) => {
  page.drawText("DH " + order.value.total.toFixed(2), {
    x: 25 + (width * 3) / 4,
    y: currentY - 10,
    font,
    size: 12,
    color,
  });

  page.drawText(t("g.fields.total"), {
    x: 100 + (width * 2) / 4,
    y: currentY - 10,
    font,
    size: 12,
    color,
  });
  page.drawLine({
    start: {
      x: 90 + (width * 2) / 4,
      y: currentY - 20,
    },
    end: {
      x: width - marginX.value,
      y: currentY - 20,
    },
    thickness: 1,
    color,
    opacity: 0.75,
  });
};

const copyPage = (originalPage: any) => {
  const cloneNode = originalPage.node.clone();

  const { Contents } = originalPage.node.normalizedEntries();
  if (Contents) cloneNode.set(PDFName.of("Contents"), Contents.clone());

  const cloneRef = originalPage.doc.context.register(cloneNode);
  const clonePage = PDFPage.of(cloneNode, cloneRef, originalPage.doc);
  return clonePage;
};
</script>

<template>
  <main class="w-full h-full flex gap-2 min-h-[calc(100vh-68px)]">
    <iframe ref="pdfRef" class="flex-1" />
    <Card class="w-1/2 md:w-1/3 min-w-[500px]">
      <CardHeader>
        <CardTitle> configuration </CardTitle>
      </CardHeader>
      <CardContent>
        <Label> Template </Label>
        <UiUploader
          @save:base64="setDocumentTemplate"
          name="Pdf"
          :extensions="['pdf']"
        />
        <Label> Top margin </Label>
        <Input v-model="marginTop" />
        <Label> Bottom margin </Label>
        <Input v-model="marginBottom" />
        <Label> Vertical margin </Label>
        <Input v-model="marginX" />
      </CardContent>
    </Card>
  </main>
</template>
