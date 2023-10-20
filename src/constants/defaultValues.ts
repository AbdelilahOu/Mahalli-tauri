export const INVOICE_CREATE = {
  client_id: undefined,
  invoice_items: [],
  status: String(),
};

export const INVOICE_UPDATE = {
  id: undefined,
  total: undefined,
  client_id: undefined,
  invoice_items: [],
};

export const ORDER_CREATE = {
  status: String(),
  seller_id: undefined,
  order_items: [],
};

export const ORDER_UPDATE = {
  id: undefined,
  status: undefined,
  seller_id: undefined,
  order_items: [],
};

export const INVOICE_ITEM_CREATE = [
  {
    product_id: undefined,
    quantity: undefined,
  },
];

export const ORDER_ITEM_CREATE = [
  {
    product_id: undefined,
    quantity: undefined,
    price: undefined,
  },
];

export const CHART_OPTIONS = {
  responsive: true,
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "rgba(25,23,17,0.6)",
        textStrokeWidth: 10,
      },
      border: {
        display: false,
      },
    },
    y: {
      grid: {
        lineWidth: 1,
        drawBorder: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: "rgba(25,23,17,0.6)",
        min: 0,
        textStrokeWidth: 1,
        padding: 10,
      },
    },
  },
};

export const CHART_WO_TICKS = {
  responsive: true,
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "rgba(25,23,17,0.6)",
        textStrokeWidth: 10,
      },
      border: {
        display: false,
      },
    },
    y: {
      grid: {
        lineWidth: 0.5,
        drawBorder: false,
      },
      border: {
        display: false,
      },
      ticks: {
        display: false,
        // color: "rgba(25,23,17,0.6)",
        // min: 0,
        // textStrokeWidth: 1,
        // padding: 10,
      },
    },
  },
};
