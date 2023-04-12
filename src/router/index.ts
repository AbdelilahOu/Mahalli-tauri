import { createRouter, createWebHistory } from "vue-router";
import { NotificationsView } from "@/views/NotificationsView";
import { CommandDetails } from "@/views/CommandDetails";
import { InvoiceDetails } from "@/views/InvoiceDetails";
import { ClientDetails } from "@/views/ClientDetails";
import { SellerDetails } from "@/views/SellerDetails";
import { CommandIndex } from "@/views/CommandIndex";
import { InvoiceIndex } from "@/views/InvoiceIndex";
import { ProductView } from "@/views/ProductView";
import { CommandView } from "@/views/CommandView";
import { InvoiceView } from "@/views/InvoiceView";
import { ClientIndex } from "@/views/ClientIndex";
import { SellerIndex } from "@/views/SellerIndex";
import { SellerView } from "@/views/SellerView";
import { ClientView } from "@/views/ClientView";
import { StockView } from "@/views/StockView";
import { StatsView } from "@/views/StatsView";
import { CrediView } from "@/views/CrediView";
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
          component: ProductView,
        },
        {
          path: "Home",
          name: "Home",
          component: HomeView,
        },
        {
          path: "Clients",
          name: "Clients",
          component: ClientIndex,
          children: [
            {
              path: "all",
              name: "Clients",
              component: ClientView,
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
          component: SellerIndex,
          children: [
            {
              path: "all",
              name: "Sellers",
              component: SellerView,
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
          component: StockView,
        },
        {
          path: "Commands/",
          name: "Command",
          component: CommandIndex,
          children: [
            {
              path: "all",
              name: "Commands",
              component: CommandView,
            },
            {
              path: "command/:id",
              name: "CommandDetails",
              component: CommandDetails,
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
          component: InvoiceIndex,
          children: [
            {
              path: "all",
              name: "Invoices",
              component: InvoiceView,
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
          path: "Credi",
          name: "Credi",
          component: CrediView,
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
