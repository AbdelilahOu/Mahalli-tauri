interface RouteLinksTypeT {
  path: string;
  name: string;
  component: string;
  display: boolean;
}

// Routes
export const RouteLinks: RouteLinksTypeT[] = [
  {
    path: "/Clients/all",
    component: "Clients",
    name: "Clients",
    display: true,
  },
  {
    path: "/Suppliers/all",
    component: "Suppliers",
    name: "Suppliers",
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
    path: "/Inventory",
    component: "Inventory",
    name: "Inventory",
    display: true,
  },
  {
    path: "/Stats",
    component: "Stats",
    name: "Statistics",
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
