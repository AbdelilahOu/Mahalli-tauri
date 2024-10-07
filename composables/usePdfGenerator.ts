import { PDFDocument, PDFName, PDFPage, PageSizes, rgb } from "pdf-lib";
import type { PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { toast } from "vue-sonner";
import CairoRegular from "@/assets/fonts/Cairo-Regular.ttf";

export function usePdfGenerator() {
  const { t, locale, n, d } = useI18n();
  const { numberToText } = useNumberToText();

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

  async function generatePdf(data: any, type: "order" | "invoice" | "quote") {
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

      drawHeader(page, width, height, data, type);

      page.drawLine({
        start: {
          x: config.marginX,
          y: height - config.marginTop - 20 * 7 + 10,
        },
        end: {
          x: width - config.marginX,
          y: height - config.marginTop - 20 * 7 + 10,
        },
        thickness: 1,
        color: config.color,
        opacity: 0.75,
      });

      const items = [...data.items];
      drawItems(
        page,
        width,
        items,
        height - config.marginTop - 20 * 7,
        data,
        template
      );

      return await pdfDoc.saveAsBase64({ dataUri: true });
    } catch (err) {
      toast.error(t("notifications.error.title"), {
        description: t("notifications.error.description"),
        closeButton: true,
      });
      console.error(`ERROR PDF-LIB: ${err}`);
    }
  }

  function drawHeader(
    page: PDFPage,
    width: number,
    height: number,
    data: any,
    type: "order" | "invoice" | "quote"
  ) {
    let headerText = "";
    switch (type) {
      case "order":
        headerText = getOrderText();
        break;
      case "invoice":
        headerText = getInvoiceText();
        break;
      case "quote":
        headerText = getQuoteText();
        break;
    }

    let headerDetailsX = getHeaderDetailsX(width, headerText, data.identifier);

    page.drawText(headerText, {
      x: headerDetailsX,
      y: height - config.marginTop,
      font,
      size: 30,
      color: config.color,
    });

    page.drawText(data.identifier, {
      x: headerDetailsX,
      y: height - config.marginTop - 20,
      font,
      size: 13,
      color: config.color,
    });

    page.drawText(d(new Date(data.created_at)), {
      x: headerDetailsX,
      y: height - config.marginTop - 40,
      font,
      size: 13,
      color: config.color,
    });

    if (type !== "quote") {
      page.drawText(t(`status.${data.status.toLowerCase()}`), {
        x: headerDetailsX,
        y: height - config.marginTop - 60,
        font,
        size: 13,
        color: config.color,
      });
    }

    drawClientInfo(page, width, height, data.client);
  }

  function drawClientInfo(
    page: PDFPage,
    width: number,
    height: number,
    client: any
  ) {
    page.drawText(t("fields.bill-to").toUpperCase(), {
      x: config.marginX,
      y: height - config.marginTop,
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
        y: height - config.marginTop - 20 * (index + 1),
        font,
        size: 13,
        color: config.color,
      });
    });

    drawTableHeaders(page, width, height);
  }

  function drawTableHeaders(page: PDFPage, width: number, height: number) {
    page.drawLine({
      start: { x: config.marginX, y: height - config.marginTop - 20 * 5 },
      end: { x: width - config.marginX, y: height - config.marginTop - 20 * 5 },
      thickness: 1,
      color: config.color,
      opacity: 0.75,
    });

    const headers = ["name", "quantity", "price", "total"];
    headers.forEach((header, index) => {
      page.drawText(t(`fields.${header}`), {
        x: config.marginX + 5 + (width * index) / 4,
        y: height - config.marginTop - 20 * 6,
        font,
        size: 14,
        color: config.color,
      });
    });
  }

  function drawItems(
    page: PDFPage,
    width: number,
    items: any[],
    currentY: number,
    data: any,
    template?: PDFPage
  ) {
    if (items.length === 0) {
      drawSummary(page, width, currentY, data);
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
    page.drawText(n(item?.quantity, "decimal"), {
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
      end: { x: width - config.marginX, y: currentY - 20 },
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
        data,
        template
      );
    } else {
      drawItems(page, width, items, currentY - lineHeight, data, template);
    }
  }

  function drawSummary(
    page: PDFPage,
    width: number,
    currentY: number,
    data: any
  ) {
    let summaryX = getSummaryX(width);

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
        x: config.marginX + 5 + (width * 3) / 4,
        y: currentY - 10 - index * 30,
        font,
        size: 12,
        color: config.color,
      });

      page.drawText(t(`fields.${item.label}`).toUpperCase(), {
        x: summaryX,
        y: currentY - 10 - index * 30,
        font,
        size: 12,
        color: config.color,
      });

      page.drawLine({
        start: { x: summaryX, y: currentY - 20 - index * 30 },
        end: { x: width - config.marginX, y: currentY - 20 - index * 30 },
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
    return PDFPage.of(cloneNode, cloneRef, originalPage.doc);
  }

  function getOrderText() {
    switch (locale.value) {
      case "en":
        return "O R D E R";
      case "fr":
        return "C O M M A N D E";
      case "de":
        return "A U F T R A G";
      case "ar":
        return "طلب";
      default:
        return "O R D E R";
    }
  }

  function getInvoiceText() {
    switch (locale.value) {
      case "en":
        return "I N V O I C E";
      case "fr":
        return "F A C T U R E";
      case "de":
        return "R E C H N U N G";
      case "ar":
        return "فاتورة";
      default:
        return "I N V O I C E";
    }
  }

  function getQuoteText() {
    switch (locale.value) {
      case "en":
        return "Q U O T E";
      case "fr":
        return "D E V I";
      case "de":
        return "Z I T A T E";
      case "ar":
        return "اقتباس";
      default:
        return "Q U O T E";
    }
  }

  function getHeaderDetailsX(
    width: number,
    headerText: string,
    identifier: string
  ) {
    switch (locale.value) {
      case "en":
      case "fr":
      case "de":
        return width - font.widthOfTextAtSize(headerText, 30) - config.marginX;
      case "ar":
        return width - font.widthOfTextAtSize(identifier, 13) - config.marginX;
      default:
        return width - font.widthOfTextAtSize(headerText, 30) - config.marginX;
    }
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
