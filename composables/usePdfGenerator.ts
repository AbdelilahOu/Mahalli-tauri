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

  let pdfDoc: PDFDocument;
  let font: PDFFont;

  async function initPdfDoc() {
    try {
      pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);
      const res: any = await $fetch(CairoRegular);
      const fontBytes = await res.arrayBuffer();
      font = await pdfDoc.embedFont(fontBytes);
    } catch (err: any) {
      toast.error(t("notifications.error.title"), {
        description: t("notifications.error.description"),
        closeButton: true,
      });
      console.error(`ERROR PDF-LIB: ${err}`);
    }
  }

  function setDocumentTemplate(data: string) {
    config.templateBase64 = data;
  }

  type DocType = "order" | "invoice" | "quote";

  async function generatePdf(data: any, type: DocType) {
    await initPdfDoc();

    try {
      let page: PDFPage;
      let template: PDFPage | undefined;
      if (config.templateBase64) {
        const sourcePdfDoc = await PDFDocument.load(
          `data:application/pdf;base64,${config.templateBase64}`
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

      drawHeader(page, data, type);

      const items = [...data.items];
      drawItems(page, items, data, template);

      return await pdfDoc.saveAsBase64({ dataUri: true });
    } catch (err) {
      toast.error(t("notifications.error.title"), {
        description: t("notifications.error.description"),
        closeButton: true,
      });
      console.error(`ERROR PDF-LIB: ${err}`);
    }
  }

  function drawHeader(page: PDFPage, data: any, type: DocType) {
    let headerText = capitalizeFirstLetter(t(`fields.${type}`));

    page.drawText(headerText, {
      x: config.marginX - 2,
      y: Height.value - config.marginTop,
      font,
      size: 30,
      color: config.color,
    });

    page.drawText(data.identifier, {
      x: config.marginX,
      y: Height.value - config.marginTop - 20,
      font,
      size: 13,
      color: config.color,
    });

    if (type !== "quote") {
      page.drawText(t(`status.${data.status.toLowerCase()}`), {
        x: getMiddleX(
          t(`status.${data.status.toLowerCase()}`),
          Width.value,
          13
        ),
        y: Height.value - config.marginTop - 20,
        font,
        size: 13,
        color: config.color,
      });
    }

    page.drawText(d(new Date(data.created_at)), {
      x:
        Width.value -
        config.marginX -
        getTextWidth(d(new Date(data.created_at)), 13),
      y: Height.value - config.marginTop - 20,
      font,
      size: 13,
      color: config.color,
    });

    Height.value = Height.value - 50;

    drawClientInfo(page, data.client);
  }

  function drawClientInfo(page: PDFPage, client: any) {
    page.drawText(t("fields.bill-to").toUpperCase(), {
      x: config.marginX,
      y: Height.value - config.marginTop,
      font,
      size: 14,
      color: config.color,
    });

    const clientFields: string[] = [];
    if (config.clientFields.fullname) clientFields.push(client.full_name);
    if (config.clientFields.email) clientFields.push(client.email);
    if (config.clientFields.phone) clientFields.push(client.phone_number);
    if (config.clientFields.address) clientFields.push(client.address);

    clientFields.forEach((field, index) => {
      page.drawText(field, {
        x: config.marginX,
        y: Height.value - config.marginTop - 20 * (index + 1),
        font,
        size: 13,
        color: config.color,
      });
    });

    Height.value = Height.value - 20 * 5;

    drawTableHeaders(page);
  }

  function drawTableHeaders(page: PDFPage) {
    page.drawLine({
      start: { x: config.marginX, y: Height.value - config.marginTop },
      end: {
        x: Width.value - config.marginX,
        y: Height.value - config.marginTop,
      },
      thickness: 1,
      color: config.color,
      opacity: 0.75,
    });

    const headers = ["name", "quantity", "price", "total"];
    headers.forEach((header, index) => {
      page.drawText(t(`fields.${header}`), {
        x: config.marginX + 5 + (Width.value * index) / 4,
        y: Height.value - config.marginTop - 20,
        font,
        size: 14,
        color: config.color,
      });
    });

    page.drawLine({
      start: { x: config.marginX, y: Height.value - config.marginTop - 30 },
      end: {
        x: Width.value - config.marginX,
        y: Height.value - config.marginTop - 30,
      },
      thickness: 1,
      color: config.color,
      opacity: 0.75,
    });

    Height.value = Height.value - config.marginTop - 40;
  }

  function drawItems(
    page: PDFPage,
    items: any[],
    data: any,
    template?: PDFPage
  ) {
    if (items.length === 0) {
      drawSummary(page, data);
      return;
    }

    const item = items.shift();
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
    page.drawText(n(item.price, "currency"), {
      x: config.marginX + 5 + Width.value / 2,
      y: Height.value - 10,
      font,
      size: 12,
      color: config.color,
    });
    page.drawText(n(item.price * item.quantity, "currency"), {
      x: config.marginX + 5 + (Width.value * 3) / 4,
      y: Height.value - 10,
      font,
      size: 12,
      color: config.color,
    });
    page.drawLine({
      start: { x: config.marginX, y: Height.value - 20 },
      end: { x: Width.value - config.marginX, y: Height.value - 20 },
      thickness: 1,
      color: config.color,
      opacity: 0.75,
    });

    if (Height.value < config.marginBottom) {
      let newPage: PDFPage;
      if (template) {
        newPage = pdfDoc.addPage(copyPage(template));
      } else {
        newPage = pdfDoc.addPage();
      }
      newPage.setSize(...PageSizes.A4);
      const { width, height } = newPage.getSize();
      Width.value = width;
      Height.value = height - config.marginTop;
      drawItems(newPage, items, data, template);
    } else {
      Height.value = Height.value - 30;
      drawItems(page, items, data, template);
    }
  }

  function drawSummary(page: PDFPage, data: any) {
    let summaryX = getSummaryX(Width.value);

    const summaryItems = [
      { label: "sub-total", value: n(data.total, "currency") },
      { label: "vat-rate", value: "20%" },
      { label: "vat-amount", value: n(data.total * 0.2, "currency") },
      {
        label: "grand-total",
        value: n(data.total + data.total * 0.2, "currency"),
      },
    ];

    summaryItems.forEach((item, index) => {
      page.drawText(item.value, {
        x: config.marginX + 5 + (Width.value * 3) / 4,
        y: Height.value - 10 - index * 30,
        font,
        size: 12,
        color: config.color,
      });

      page.drawText(t(`fields.${item.label}`).toUpperCase(), {
        x: summaryX,
        y: Height.value - 10 - index * 30,
        font,
        size: 12,
        color: config.color,
      });

      page.drawLine({
        start: { x: summaryX, y: Height.value - 20 - index * 30 },
        end: {
          x: Width.value - config.marginX,
          y: Height.value - 20 - index * 30,
        },
        thickness: 1,
        color: config.color,
        opacity: 0.75,
      });
    });

    const totalAsText = numberToText(
      data.total + data.total * 0.2,
      locale.value as any
    );
    page.drawText(totalAsText, {
      x: getMiddleX(totalAsText, Width.value, 13),
      y: Height.value - 130,
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
    return PDFPage.of(cloneNode, cloneRef, originalPage.doc);
  }

  function getTextWidth(text: string, fontSize: number) {
    return font.widthOfTextAtSize(text, fontSize);
  }

  function getMiddleX(text: string, width: number, fontSize: number) {
    return (width - font.widthOfTextAtSize(text, fontSize)) / 2;
  }

  function capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function getSummaryX(width: number) {
    switch (locale.value) {
      case "en":
      case "fr":
        return width - width / 2 + 60;
      case "de":
        return width - width / 2 - 20;
      case "ar":
        return width - width / 2 + 30;
      default:
        return width - width / 2 + 60;
    }
  }

  return {
    config,
    setDocumentTemplate,
    generatePdf,
  };
}
