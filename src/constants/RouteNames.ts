import type { RouteLinksTypeT } from "../types";

// Routes
export const RouteLinks: RouteLinksTypeT[] = [
  {
    path: "/Clients/all",
    component: "Clients",
    name: "Clients",
    display: true,
  },
  {
    path: "/Sellers/all",
    component: "Sellers",
    name: "Sellers",
    display: true,
  },
  {
    path: "/Products",
    component: "Products",
    name: "Products",
    display: true,
  },
  {
    path: "/Orders/all",
    component: "Orders",
    name: "Orders",
    display: true,
  },
  {
    path: "/Invoices/all",
    component: "Invoices",
    name: "Invoices",
    display: true,
  },
  {
    path: "/Stocks",
    component: "Stocks",
    name: "Stock",
    display: true,
  },
  {
    path: "/Stats",
    component: "Stats",
    name: "Statistics",
    display: true,
  },
  {
    path: "/Payment",
    component: "Payment",
    name: "Payment",
    display: true,
  },
  {
    path: "/OrdersDetails",
    component: "OrdersDetails",
    name: "Orders",
    display: false,
  },
  {
    path: "/InvoiceDetails",
    component: "InvoiceDetails",
    name: "Invoices",
    display: false,
  },
  {
    path: "/ClientDetails",
    component: "ClientDetails",
    name: "Clients",
    display: false,
  },
  {
    path: "/SellerDetails",
    component: "SellerDetails",
    name: "Sellers",
    display: false,
  },
];
