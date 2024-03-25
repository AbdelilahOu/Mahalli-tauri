<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import { invoke } from "@tauri-apps/api";
import { useI18n } from "vue-i18n";
import { error } from "tauri-plugin-log-api";
import type { Res } from "@/types";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  PageSizes,
  PDFPage,
  PDFFont,
  type RGB,
} from "pdf-lib";
import { onMounted } from "vue";

const { t, d } = useI18n();
const id = useRoute().params.id;
const invoice = ref<any | null>(null);
const pdfRef = ref<HTMLIFrameElement | null>();
//
let resolveWaitForFetch: (value?: unknown) => void;
let waitForFetch = new Promise((r) => (resolveWaitForFetch = r));
let pdfDoc: PDFDocument;

onBeforeMount(async () => {
  try {
    const res = await invoke<Res<any>>("get_invoice_details", {
      id,
    });
    invoice.value = res.data;
    resolveWaitForFetch();
  } catch (err: any) {
    console.log(err);
    error("Error creating client : " + err.error);
  }
});

onMounted(async () => {
  await waitForFetch;
  pdfDoc = await PDFDocument.create();
  generatePdf();
});

const generatePdf = async () => {
  const mainColor = rgb(0.34, 0.34, 0.34);
  const page = pdfDoc.addPage();
  const HelveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  page.setSize(...PageSizes.A4);
  const { width, height } = page.getSize();

  drawInvoiceHeader(
    page,
    width,
    height,
    HelveticaFont,
    mainColor,
    invoice.value,
  );

  page.drawLine({
    start: { x: 20, y: height - 200 },
    end: { x: width - 20, y: height - 200 },
    thickness: 1,
    color: mainColor,
    opacity: 0.75,
  });

  const items = [...invoice.value.items];
  drawInvoiceItems(page, width, height, HelveticaFont, mainColor, items, 210);

  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
  pdfRef.value?.setAttribute("src", pdfDataUri);
};

const drawInvoiceHeader = (
  page: PDFPage,
  width: number,
  height: number,
  font: PDFFont,
  color: RGB,
  invoice: any,
) => {
  page.drawText("I N V O I C E", {
    x: width - 190,
    y: height - 40,
    font,
    size: 30,
    color,
  });
  page.drawText("Date: " + invoice.createdAt ?? "", {
    x: width - 190,
    y: height - 70,
    font,
    size: 13,
    color,
  });
  page.drawText("Status: " + invoice.status.toLowerCase() ?? "", {
    x: width - 190,
    y: height - 90,
    font,
    size: 13,
    color,
  });
  //
  page.drawText("Client: " + invoice.client.fullname ?? "", {
    x: 20,
    y: height - 70,
    font,
    size: 13,
    color,
  });
  page.drawText("Address: " + invoice.client.address ?? "", {
    x: 20,
    y: height - 90,
    font,
    size: 13,
    color,
  });
  page.drawText("Phone number: " + invoice.client.phoneNumber ?? "", {
    x: 20,
    y: height - 110,
    font,
    size: 13,
    color,
  });
  page.drawText("Email: " + invoice.client.email ?? "", {
    x: 20,
    y: height - 130,
    font,
    size: 13,
    color,
  });
  //
  page.drawLine({
    start: { x: 20, y: height - 170 },
    end: { x: width - 20, y: height - 170 },
    thickness: 1,
    color,
    opacity: 0.75,
  });
  page.drawText("Product name", {
    x: 25,
    y: height - 190,
    font,
    size: 14,
    color,
  });
  page.drawText("Price", {
    x: 25 + width / 4,
    y: height - 190,
    font,
    size: 14,
    color,
  });

  page.drawText("Quantity", {
    x: 25 + width / 2,
    y: height - 190,
    font,
    size: 14,
    color,
  });

  page.drawText("Total", {
    x: 25 + (width * 3) / 4,
    y: height - 190,
    font,
    size: 14,
    color,
  });
};

const drawInvoiceItems = (
  page: PDFPage,
  width: number,
  height: number,
  font: PDFFont,
  color: RGB,
  items: any[],
  currentY: number,
) => {
  if (items.length === 0) {
    drawSummary(page, width, height, currentY);
    return;
  }

  const item = items.shift();
  page.drawText(item.name, {
    x: 25,
    y: height - currentY - 10,
    font,
    size: 12,
    color,
  });
  page.drawText("DH " + item.price.toFixed(2), {
    x: 25 + width / 4,
    y: height - currentY - 10,
    font,
    size: 12,
    color,
  });
  page.drawText(item.quantity.toFixed(2), {
    x: 25 + width / 2,
    y: height - currentY - 10,
    font,
    size: 12,
    color,
  });
  page.drawText("DH " + String(item.price * item.quantity), {
    x: 25 + (width * 3) / 4,
    y: height - currentY - 10,
    font,
    size: 12,
    color,
  });
  page.drawLine({
    start: { x: 20, y: height - currentY - 20 },
    end: { x: width - 20, y: height - currentY - 20 },
    thickness: 1,
    color,
    opacity: 0.75,
  });

  const lineHeight = 30; // Assuming a line height for each item
  const remainingHeight = height - currentY - lineHeight;
  if (remainingHeight < lineHeight + 30) {
    // Not enough space, create a new page and continue
    const newPage = pdfDoc.addPage();
    drawInvoiceItems(newPage, width, height, font, color, items, lineHeight);
  } else {
    // Enough space, continue drawing on current page
    drawInvoiceItems(
      page,
      width,
      height,
      font,
      color,
      items,
      currentY + lineHeight,
    );
  }
};

const drawSummary = (
  page: PDFPage,
  width: number,
  height: number,
  currentY: number,
) => {};
</script>

<template>
  <main class="w-full h-screen">
    <iframe ref="pdfRef" style="width: 100%; height: 100%" />
  </main>
</template>
