<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import { invoke } from "@tauri-apps/api";
import { useI18n } from "vue-i18n";
import { error } from "tauri-plugin-log-api";
import type { Res } from "@/types";
import { PDFDocument, StandardFonts, rgb, PageSizes } from "pdf-lib";
import { onMounted } from "vue";

const { t, d } = useI18n();
const id = useRoute().params.id;
const invoice = ref<any | null>(null);
const pdfRef = ref<HTMLIFrameElement | null>();
//
let resolveWaitForFetch: (value?: unknown) => void;
let waitForFetch = new Promise((r) => (resolveWaitForFetch = r));

onBeforeMount(async () => {
  try {
    const res = await invoke<Res<any>>("get_invoice_details", {
      id,
    });
    invoice.value = res.data;
    console.log(res.data);
    resolveWaitForFetch();
  } catch (err: any) {
    console.log(err);
    error("Error creating client : " + err.error);
  }
});

onMounted(async () => {
  await waitForFetch;
  generatePdf();
});

const generatePdf = async () => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const HelveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  page.setSize(...PageSizes.A4);
  const { width, height } = page.getSize();
  page.drawText("I N V O I C E", {
    x: width - 190,
    y: height - 40,
    font: HelveticaFont,
    size: 30,
    color: rgb(0.34, 0.34, 0.34),
  });
  page.drawText("Date: " + invoice.value.createdAt ?? "", {
    x: width - 190,
    y: height - 70,
    font: HelveticaFont,
    size: 13,
    color: rgb(0.34, 0.34, 0.34),
  });
  page.drawText("Status: " + invoice.value.status.toLowerCase() ?? "", {
    x: width - 190,
    y: height - 90,
    font: HelveticaFont,
    size: 13,
    color: rgb(0.34, 0.34, 0.34),
  });
  //
  page.drawText("Client: " + invoice.value.client.fullname ?? "", {
    x: 20,
    y: height - 70,
    font: HelveticaFont,
    size: 13,
    color: rgb(0.34, 0.34, 0.34),
  });
  page.drawText("Address: " + invoice.value.client.address ?? "", {
    x: 20,
    y: height - 90,
    font: HelveticaFont,
    size: 13,
    color: rgb(0.34, 0.34, 0.34),
  });
  page.drawText("Phone number: " + invoice.value.client.phoneNumber ?? "", {
    x: 20,
    y: height - 110,
    font: HelveticaFont,
    size: 13,
    color: rgb(0.34, 0.34, 0.34),
  });
  page.drawText("Email: " + invoice.value.client.email ?? "", {
    x: 20,
    y: height - 130,
    font: HelveticaFont,
    size: 13,
    color: rgb(0.34, 0.34, 0.34),
  });
  //
  page.drawLine({
    start: { x: 20, y: height - 170 },
    end: { x: width - 20, y: height - 170 },
    thickness: 1,
    color: rgb(0.34, 0.34, 0.34),
    opacity: 0.75,
  });
  page.drawText("Product name", {
    x: 25,
    y: height - 190,
    font: HelveticaFont,
    size: 14,
    color: rgb(0.34, 0.34, 0.34),
  });
  page.drawText("Price", {
    x: 25 + width / 4,
    y: height - 190,
    font: HelveticaFont,
    size: 14,
    color: rgb(0.34, 0.34, 0.34),
  });

  page.drawText("Quantity", {
    x: 25 + width / 2,
    y: height - 190,
    font: HelveticaFont,
    size: 14,
    color: rgb(0.34, 0.34, 0.34),
  });

  page.drawText("Total", {
    x: 25 + (width * 3) / 4,
    y: height - 190,
    font: HelveticaFont,
    size: 14,
    color: rgb(0.34, 0.34, 0.34),
  });

  page.drawLine({
    start: { x: 20, y: height - 200 },
    end: { x: width - 20, y: height - 200 },
    thickness: 1,
    color: rgb(0.34, 0.34, 0.34),
    opacity: 0.75,
  });

  for (let [index, item] of invoice.value.items.entries()) {
    page.drawText(item.name, {
      x: 25,
      y: height - 220 - index * 30,
      font: HelveticaFont,
      size: 12,
      color: rgb(0.34, 0.34, 0.34),
    });
    page.drawText("DH " + item.price.toFixed(2), {
      x: 25 + width / 4,
      y: height - 220 - index * 30,
      font: HelveticaFont,
      size: 12,
      color: rgb(0.34, 0.34, 0.34),
    });

    page.drawText(item.quantity.toFixed(2), {
      x: 25 + width / 2,
      y: height - 220 - index * 30,
      font: HelveticaFont,
      size: 12,
      color: rgb(0.34, 0.34, 0.34),
    });

    page.drawText("DH " + String(item.price * item.quantity), {
      x: 25 + (width * 3) / 4,
      y: height - 220 - index * 30,
      font: HelveticaFont,
      size: 12,
      color: rgb(0.34, 0.34, 0.34),
    });

    page.drawLine({
      start: { x: 20, y: height - 230 - index * 30 },
      end: { x: width - 20, y: height - 230 - index * 30 },
      thickness: 1,
      color: rgb(0.34, 0.34, 0.34),
      opacity: 0.75,
    });
  }

  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
  pdfRef.value?.setAttribute("src", pdfDataUri);
};
</script>

<template>
  <main class="w-full h-screen">
    <iframe ref="pdfRef" style="width: 100%; height: 100%"></iframe>
  </main>
</template>
