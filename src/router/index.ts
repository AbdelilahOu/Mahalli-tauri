import { createRouter, createWebHistory } from "vue-router";
import { NotificationsView } from "@/views/NotificationsView";
import { InvoiceDetails } from "@/views/InvoiceDetails";
import { ClientDetails } from "@/views/ClientDetails";
import { SellerDetails } from "@/views/SellerDetails";
import { InvoicesIndex } from "@/views/InvoicesIndex";
import { OrdersDetails } from "@/views/OrderDetails";
import { ProductsView } from "@/views/ProductsView";
import { InvoicesView } from "@/views/InvoicesView";
import { ClientsIndex } from "@/views/ClientsIndex";
import { SellersIndex } from "@/views/SellersIndex";
import { OrdersIndex } from "@/views/OrdersIndex";
import { SellersView } from "@/views/SellersView";
import { ClientsView } from "@/views/ClientsView";
import { PaymentView } from "@/views/PaymentView";
import { OrdersView } from "@/views/OrdersView";
import { StocksView } from "@/views/StocksView";
import { StatsView } from "@/views/StatsView";
import { HomeView } from "@/views/HomeView";
import { IndexView } from "@/views/IndexView";
import { AuthView } from "@/views/AuthView";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Index",
      component: IndexView,
      children: [
        {
          path: "Products",
          name: "Products",
          component: ProductsView,
        },
        {
          path: "Home",
          name: "Home",
          component: HomeView,
        },
        {
          path: "Clients",
          name: "Clients",
          component: ClientsIndex,
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
          path: "Sellers",
          name: "Sellers",
          component: SellersIndex,
          children: [
            {
              path: "all",
              name: "Sellers",
              component: SellersView,
            },
            {
              path: "seller/:id",
              name: "SellerDetails",
              component: SellerDetails,
            },
          ],
        },
        {
          path: "Stocks",
          name: "Stocks",
          component: StocksView,
        },
        {
          path: "Orders/",
          name: "Orders",
          component: OrdersIndex,
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
          component: InvoicesIndex,
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
        {
          path: "Payment",
          name: "Payment",
          component: PaymentView,
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
