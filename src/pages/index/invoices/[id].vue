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
    size: 15,
    color: rgb(0.34, 0.34, 0.34),
  });
  page.drawText("Status: " + invoice.value.status ?? "", {
    x: width - 190,
    y: height - 90,
    font: HelveticaFont,
    size: 15,
    color: rgb(0.34, 0.34, 0.34),
  });
  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
  pdfRef.value?.setAttribute("src", pdfDataUri);
};
</script>

<template>
  <main class="w-full h-screen">
    <iframe ref="pdfRef" style="width: 100%; height: 100%"></iframe>
  </main>
</template>
