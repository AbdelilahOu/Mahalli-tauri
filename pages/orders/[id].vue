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
import type { PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import CairoRegular from "@/assets/fonts/Cairo-Regular.ttf";
import { toast } from "vue-sonner";
import { useDebounceFn } from "@vueuse/core";

const { t, locale } = useI18n();
const { numberToWords } = useNumberToWords();
const id = useRoute().params.id;
const order = ref<any | null>(null);
const pdfRef = ref<HTMLIFrameElement | null>();
// pdf layout setting
const config = reactive({
  marginTop: 40,
  marginX: 20,
  marginBottom: 120,
  templateBase64: null as string | null,
  color: rgb(0.34, 0.34, 0.34),
});
//
let resolveWaitForFetch: (value?: unknown) => void;
const waitForFetch = new Promise((r) => (resolveWaitForFetch = r));
let pdfDoc: PDFDocument;
let font: PDFFont;

const setDocumentTemplate = (data: string) => {
  config.templateBase64 = data;
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
    if (typeof err == "object" && "error" in err) {
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

watch(
  () => config.templateBase64,
  () => {
    initPdfDoc();
  }
);

const debouncedRegenerate = useDebounceFn(() => {
  initPdfDoc();
}, 700);

watch(
  () => [config.marginTop, config.marginX, config.marginBottom],
  debouncedRegenerate
);

const initPdfDoc = async () => {
  pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  if (locale.value == "ar") {
    const res = await fetch(CairoRegular);
    const fontBytes = await res.arrayBuffer();
    font = await pdfDoc.embedFont(fontBytes);
  } else {
    font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  }
  generatePdf();
};

const generatePdf = async () => {
  try {
    let page: PDFPage;
    let Tempalte: PDFPage | undefined;
    if (config.templateBase64) {
      const sourcePdfDoc = await PDFDocument.load(
        "data:application/pdf;base64," + config.templateBase64
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
    drawOrderItems(
      page,
      width,
      items,
      height - config.marginTop - 20 * 7,
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
    y: height - config.marginTop,
    font,
    size: 30,
    color: config.color,
  });
  page.drawText(order.identifier, {
    x: width - 190,
    y: height - config.marginTop - 20,
    font,
    size: 13,
    color: config.color,
  });
  page.drawText(order.createdAt.split(" ")[0], {
    x: width - 190,
    y: height - config.marginTop - 40,
    font,
    size: 13,
    color: config.color,
  });
  page.drawText(t("g.status." + order.status.toLowerCase()), {
    x: width - 190,
    y: height - config.marginTop - 60,
    font,
    size: 13,
    color: config.color,
  });
  //
  page.drawText(t("i.u.d.c.title").toUpperCase(), {
    x: config.marginX,
    y: height - config.marginTop,
    font,
    size: 14,
    color: config.color,
  });
  page.drawText(order.client.fullname, {
    x: config.marginX,
    y: height - config.marginTop - 20,
    font,
    size: 13,
    color: config.color,
  });
  page.drawText(order.client.address, {
    x: config.marginX,
    y: height - config.marginTop - 20 * 2,
    font,
    size: 13,
    color: config.color,
  });
  page.drawText(order.client.phoneNumber, {
    x: config.marginX,
    y: height - config.marginTop - 20 * 3,
    font,
    size: 13,
    color: config.color,
  });
  page.drawText(order.client.email, {
    x: config.marginX,
    y: height - config.marginTop - 20 * 4,
    font,
    size: 13,
    color: config.color,
  });
  //
  page.drawLine({
    start: { x: config.marginX, y: height - config.marginTop - 20 * 5 },
    end: { x: width - config.marginX, y: height - config.marginTop - 20 * 5 },
    thickness: 1,
    color: config.color,
    opacity: 0.75,
  });
  page.drawText(t("g.fields.name"), {
    x: 25,
    y: height - config.marginTop - 20 * 6,
    font,
    size: 14,
    color: config.color,
  });
  page.drawText(t("g.fields.price"), {
    x: 25 + width / 4,
    y: height - config.marginTop - 20 * 6,
    font,
    size: 14,
    color: config.color,
  });

  page.drawText(t("g.fields.quantity"), {
    x: 25 + width / 2,
    y: height - config.marginTop - 20 * 6,
    font,
    size: 14,
    color: config.color,
  });

  page.drawText(t("g.fields.total"), {
    x: 25 + (width * 3) / 4,
    y: height - config.marginTop - 20 * 6,
    font,
    size: 14,
    color: config.color,
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
    color: config.color,
  });
  page.drawText("DH " + item.price.toFixed(2), {
    x: 25 + width / 4,
    y: currentY - 10,
    font,
    size: 12,
    color: config.color,
  });
  page.drawText(item.quantity.toFixed(0), {
    x: 25 + width / 2,
    y: currentY - 10,
    font,
    size: 12,
    color: config.color,
  });
  page.drawText("DH " + (item.price * item.quantity).toFixed(2), {
    x: 25 + (width * 3) / 4,
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
    drawOrderItems(
      newPage,
      width,
      items,
      newPage.getHeight() - config.marginTop,
      template
    );
  } else {
    drawOrderItems(page, width, items, currentY - lineHeight, template);
  }
};

const drawSummary = (page: PDFPage, width: number, currentY: number) => {
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

  page.drawText("DH " + order.value.total.toFixed(2), {
    x: 25 + (width * 3) / 4,
    y: currentY - 10,
    font,
    size: 12,
    color: config.color,
  });

  page.drawText(t("g.fields.sub-total").toUpperCase(), {
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
    x: 25 + (width * 3) / 4,
    y: currentY - 40,
    font,
    size: 12,
    color: config.color,
  });

  page.drawText(t("g.fields.vat-rate").toUpperCase(), {
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

  page.drawText("DH " + (order.value.total * 0.2).toFixed(2), {
    x: 25 + (width * 3) / 4,
    y: currentY - 70,
    font,
    size: 12,
    color: config.color,
  });

  page.drawText(t("g.fields.vat-amount").toUpperCase(), {
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

  page.drawText(
    "DH " + (order.value.total + order.value.total * 0.2).toFixed(2),
    {
      x: 25 + (width * 3) / 4,
      y: currentY - 100,
      font,
      size: 12,
      color: config.color,
    }
  );

  page.drawText(t("g.fields.grand-total").toUpperCase(), {
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

  const totalAsText = numberToWords(
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
        <CardTitle> {{ t("g.fields.configuration") }} </CardTitle>
      </CardHeader>
      <CardContent>
        <Label> {{ t("g.fields.template") }} </Label>
        <UiUploader
          @save:base64="setDocumentTemplate"
          name="Pdf"
          :extensions="['pdf']"
        />
        <Label>{{ t("g.fields.top-margin") }} </Label>
        <Input v-model="config.marginTop" />
        <Label> {{ t("g.fields.bottom-margin") }} </Label>
        <Input v-model="config.marginBottom" />
      </CardContent>
    </Card>
  </main>
</template>
