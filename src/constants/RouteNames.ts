interface RouteLinksTypeT {
  path: string;
  name: string;
  component: string;
  display: boolean;
}

// Routes
export const RouteLinks: RouteLinksTypeT[] = [
  {
    path: "/clients/",
    component: "Clients",
    name: "Clients",
    display: true,
  },
  {
    path: "/suppliers/",
    component: "Suppliers",
    name: "Suppliers",
    display: true,
  },
  {
    path: "/products/",
    component: "Products",
    name: "Products",
    display: true,
  },
  {
    path: "/orders/",
    component: "Orders",
    name: "Orders",
    display: true,
  },
  {
    path: "/invoices/",
    component: "Invoices",
    name: "Invoices",
    display: true,
  },
  {
    path: "/inventory/",
    component: "Inventory",
    name: "Inventory",
    display: true,
  },
  {
    path: "/dashboard/",
    component: "Dashboard",
    name: "Dashboard",
    display: true,
  },
  // {
  //   path: "/Payment",
  //   component: "Payment",
  //   name: "Payment",
  //   display: true,
  // },
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
    path: "/SupplierDetails",
    component: "SupplierDetails",
    name: "Suppliers",
    display: false,
  },
];
