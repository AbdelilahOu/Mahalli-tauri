import { PDFDocument, PDFName, PDFPage, PageSizes, rgb } from "pdf-lib";
import type { PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { toast } from "vue-sonner";
import CairoRegular from "@/assets/fonts/Cairo-Regular.ttf";

export function usePdfGenerator() {
  const { t, locale, n, d } = useI18n();
  const { numberToText } = useNumberToText();

  const Width = ref(0);
  const Height = ref(0);

  let pdfDoc: PDFDocument;
  let font: PDFFont;
  let page: PDFPage;
  let template: PDFPage | undefined;

  const config = reactive({
    marginTop: 40,
    marginX: 20,
    marginBottom: 90,
    templateBase64: null as string | null,
    color: rgb(0.34, 0.34, 0.34),
    clientFields: {
      full_name: true,
      email: true,
      address: true,
      phone_number: true,
    },
  });

  async function initPdfDoc() {
    try {
      pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);
      const res: any = await $fetch(CairoRegular);
      const fontBytes = await res.arrayBuffer();
      font = await pdfDoc.embedFont(fontBytes);
    } catch (err: any) {
      handleError(err);
    }
  }

  function setDocumentTemplate(data: string) {
    config.templateBase64 = data;
  }

  type DocType = "order" | "invoice" | "quote";

  async function generatePdf(data: any, type: DocType) {
    await initPdfDoc();
    if (!pdfDoc || !font) return;

    setPdfMetadata(pdfDoc, data, type);

    try {
      await setupPage(data.identifier);
      drawContent(data, type);
      return await pdfDoc.saveAsBase64({ dataUri: true });
    } catch (err) {
      handleError(err);
    }
  }

  function setPdfMetadata(pdfDoc: PDFDocument, data: any, type: DocType) {
    pdfDoc.setTitle(data.identifier);
    pdfDoc.setAuthor("trymahalli.com");
    pdfDoc.setSubject(type);
    pdfDoc.setProducer("trymahalli.com");
    pdfDoc.setCreator("trymahalli.com");
  }

  async function setupPage(identifier: string) {
    if (!pdfDoc) return;

    if (config.templateBase64) {
      const sourcePdfDoc = await PDFDocument.load(
        `data:application/pdf;headers=filename%3D${identifier};base64,${config.templateBase64}`
      );
      const [templatePage] = await pdfDoc.copyPages(sourcePdfDoc, [0]);
      template = templatePage;
      page = pdfDoc.addPage(copyPage(template));
    } else {
      page = pdfDoc.addPage();
    }

    page.setSize(...PageSizes.A4);
    const { width, height } = page.getSize();
    Width.value = width;
    Height.value = height;
  }

  function drawContent(data: any, type: DocType) {
    if (!page || !font) return;
    Height.value -= config.marginTop;
    drawHeader(data, type);
    drawSenderAndReceiver(data.client);
    drawTableHeaders();
    drawItems(data.items);
    drawSummary(getSummaryItems(data));
    drawTotalAsText(data.total + data.total * 0.2);
  }

  function drawHeader(data: any, type: DocType) {
    if (!page || !font) return;

    const headerText = capitalizeFirstLetter(t(`fields.${type}`));
    const totalText = n(data.total + data.total * 0.2, "currency");

    page.drawText(headerText, {
      x: config.marginX - 1,
      y: Height.value,
      font,
      size: 30,
      color: config.color,
    });

    page.drawText(reverseText(totalText), {
      x: Width.value - config.marginX - getTextWidth(totalText, 20),
      y: Height.value,
      font,
      size: 20,
      color: config.color,
    });

    page.drawText(data.identifier, {
      x: config.marginX,
      y: Height.value - 20,
      font,
      size: 13,
      color: config.color,
    });

    if (type !== "quote") {
      const statusText = t(`status.${data.status.toLowerCase()}`);
      page.drawText(statusText, {
        x: getMiddleX(statusText, Width.value, 13),
        y: Height.value - 20,
        font,
        size: 13,
        color: config.color,
      });
    }

    const dateText = d(new Date(data.created_at));
    page.drawText(dateText, {
      x: Width.value - config.marginX - getTextWidth(dateText, 13),
      y: Height.value - 20,
      font,
      size: 13,
      color: config.color,
    });

    Height.value -= 50;
  }

  function drawSenderAndReceiver(client: any) {
    if (!page || !font) return;

    page.drawText(t("fields.bill-to").toUpperCase(), {
      x: config.marginX,
      y: Height.value,
      font,
      size: 14,
      color: config.color,
    });

    const clientFields = getClientFields(client);
    clientFields.forEach((field, index) => {
      page?.drawText(field, {
        x: config.marginX,
        y: Height.value - 20 * (index + 1),
        font: font!,
        size: 13,
        color: config.color,
      });
    });

    Height.value -= 20 * clientFields.length + 20;
  }

  function getClientFields(client: any): string[] {
    return Object.entries(config.clientFields)
      .filter(([_, value]) => value)
      .map(([key, _]) => client[key])
      .filter((value) => value !== null);
  }

  function drawTableHeaders() {
    if (!page || !font) return;

    drawHorizontalLine(Height.value);

    const headers = ["name", "quantity", "price", "total"];
    headers.forEach((header, index) => {
      page?.drawText(t(`fields.${header}`), {
        x: config.marginX + 5 + (Width.value * index) / 4,
        y: Height.value - 20,
        font: font!,
        size: 14,
        color: config.color,
      });
    });

    drawHorizontalLine(Height.value - 30);

    Height.value -= 40;
  }

  function drawItems(items: any[]) {
    items.forEach((item) => {
      if (Height.value < config.marginBottom) {
        addNewPage();
      }

      if (!page || !font) return;

      page.drawText(item.name, {
        x: config.marginX + 5,
        y: Height.value - 10,
        font,
        size: 12,
        color: config.color,
      });

      page.drawText(n(item?.quantity, "decimal"), {
        x: config.marginX + 5 + Width.value / 4,
        y: Height.value - 10,
        font,
        size: 12,
        color: config.color,
      });

      page.drawText(reverseText(n(item.price, "currency")), {
        x: config.marginX + 5 + Width.value / 2,
        y: Height.value - 10,
        font,
        size: 12,
        color: config.color,
      });

      page.drawText(reverseText(n(item.price * item.quantity, "currency")), {
        x: config.marginX + 5 + (Width.value * 3) / 4,
        y: Height.value - 10,
        font,
        size: 12,
        color: config.color,
      });

      drawHorizontalLine(Height.value - 20);

      Height.value -= 30;
    });
  }

  function drawSummary(summaryItems: any[]) {
    summaryItems.forEach((item) => {
      if (Height.value < config.marginBottom) {
        addNewPage();
      }

      if (!page || !font) return;

      const summaryX = getSummaryX(Width.value);

      page.drawText(t(`fields.${item.label}`).toUpperCase(), {
        x: summaryX,
        y: Height.value - 10,
        font,
        size: 12,
        color: config.color,
      });

      page.drawText(item.value, {
        x: config.marginX + 5 + (Width.value * 3) / 4,
        y: Height.value - 10,
        font,
        size: 12,
        color: config.color,
      });

      drawHorizontalLine(Height.value - 20, summaryX);

      Height.value -= 30;
    });
  }

  function drawTotalAsText(total: number) {
    if (!page || !font) return;

    const totalAsText = numberToText(total, locale.value as any);

    page.drawText(totalAsText, {
      x: getMiddleX(totalAsText, Width.value, 13),
      y: Height.value - 30,
      font,
      size: 13,
      color: config.color,
    });
  }

  function copyPage(originalPage: PDFPage) {
    if (!pdfDoc) return originalPage;

    const cloneNode = originalPage.node.clone();
    const { Contents } = originalPage.node.normalizedEntries();
    if (Contents) cloneNode.set(PDFName.of("Contents"), Contents.clone());
    const cloneRef = pdfDoc.context.register(cloneNode);
    return PDFPage.of(cloneNode, cloneRef, pdfDoc);
  }

  function getTextWidth(text: string, fontSize: number) {
    return font?.widthOfTextAtSize(text, fontSize) || 0;
  }

  function getMiddleX(text: string, width: number, fontSize: number) {
    return (width - getTextWidth(text, fontSize)) / 2;
  }

  function capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function reverseText(text: string) {
    if (locale.value != "ar") return text;
    const currency = text.split("").splice(-5).join("");
    const amount = text
      .split("")
      .splice(0, text.split("").length - 6)
      .reverse()
      .join("");
    return `${amount} ${currency}`;
  }

  function getSummaryX(width: number) {
    const offsets = { en: 60, fr: 60, de: -20, ar: 30 };
    return (
      width - width / 2 + (offsets[locale.value as keyof typeof offsets] || 60)
    );
  }

  function getSummaryItems(data: any) {
    return [
      { label: "sub-total", value: reverseText(n(data.total, "currency")) },
      { label: "vat-rate", value: "20%" },
      {
        label: "vat-amount",
        value: reverseText(n(data.total * 0.2, "currency")),
      },
      {
        label: "grand-total",
        value: reverseText(n(data.total + data.total * 0.2, "currency")),
      },
    ];
  }

  function addNewPage() {
    if (!pdfDoc) return;

    let newPage: PDFPage;
    if (template) {
      newPage = pdfDoc.addPage(copyPage(template));
    } else {
      newPage = pdfDoc.addPage();
    }
    newPage.setSize(...PageSizes.A4);
    page = newPage;
    const { width, height } = newPage.getSize();
    Width.value = width;
    Height.value = height - config.marginTop;
  }

  function drawHorizontalLine(y: number, startX = config.marginX) {
    page?.drawLine({
      start: { x: startX, y },
      end: { x: Width.value - config.marginX, y },
      thickness: 1,
      color: config.color,
      opacity: 0.75,
    });
  }

  function handleError(err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    console.error(`ERROR PDF-LIB: ${err}`);
  }

  return {
    config,
    setDocumentTemplate,
    generatePdf,
  };
}
