import { createRouter, createWebHistory } from "vue-router";
import NotificationsView from "@/views/NotificationsView.vue";
import InvoiceDetails from "@/views/InvoiceDetails.vue";
import ClientDetails from "@/views/ClientDetails.vue";
import SupplierDetails from "@/views/SupplierDetails.vue";
import OrdersDetails from "@/views/OrderDetails.vue";
import ProductsView from "@/views/ProductsView.vue";
import InvoicesView from "@/views/InvoicesView.vue";
import CommenLayout from "@/layouts/CommenLayout.vue";
import SuppliersView from "@/views/SuppliersView.vue";
import ClientsView from "@/views/ClientsView.vue";
import OrdersView from "@/views/OrdersView.vue";
import InventoryView from "@/views/InventoryView.vue";
import StatsView from "@/views/StatsView.vue";
import HomeView from "@/views/HomeView.vue";
import RootLayout from "@/layouts/RootLayout.vue";
import AuthView from "@/views/AuthView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Index",
      component: RootLayout,
      children: [
        {
          path: "Products",
          name: "Products",
          component: ProductsView,
        },
        {
          path: "",
          name: "Home",
          component: HomeView,
        },
        {
          path: "Clients",
          name: "Clients",
          component: CommenLayout,
          children: [
            {
              path: "all",
              name: "Clients",
              component: ClientsView,
            },
            {
              path: "client/:id",
              name: "ClientDetails",
              component: ClientDetails,
            },
          ],
        },
        {
          path: "Suppliers",
          name: "Suppliers",
          component: CommenLayout,
          children: [
            {
              path: "all",
              name: "Suppliers",
              component: SuppliersView,
            },
            {
              path: "supplier/:id",
              name: "SupplierDetails",
              component: SupplierDetails,
            },
          ],
        },
        {
          path: "Inventory",
          name: "Inventory",
          component: InventoryView,
        },
        {
          path: "Orders/",
          name: "Orders",
          component: CommenLayout,
          children: [
            {
              path: "all",
              name: "Orders",
              component: OrdersView,
            },
            {
              path: "order/:id",
              name: "OrdersDetails",
              component: OrdersDetails,
            },
          ],
        },
        {
          path: "Stats",
          name: "Stats",
          component: StatsView,
        },
        {
          path: "Invoices/",
          name: "Invoice",
          component: CommenLayout,
          children: [
            {
              path: "all",
              name: "Invoices",
              component: InvoicesView,
            },
            {
              path: "invoice/:id",
              name: "InvoiceDetails",
              component: InvoiceDetails,
            },
          ],
        },
        {
          path: "Notifications",
          name: "Notifications",
          component: NotificationsView,
        },
      ],
    },
    {
      path: "/Auth",
      name: "Auth",
      component: AuthView,
    },
  ],
});

export default router;
