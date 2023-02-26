import { createRouter, createWebHistory } from "vue-router";
import { NotificationsView } from "@/views/content/NotificationsView";
import { CommandDetails } from "@/views/content/CommandDetails";
import { InvoiceDetails } from "@/views/content/InvoiceDetails";
import { ClientDetails } from "@/views/content/ClientDetails";
import { SellerDetails } from "@/views/content/SellerDetails";
import { CommandIndex } from "@/views/content/CommandIndex";
import { InvoiceIndex } from "@/views/content/InvoiceIndex";
import { ProductView } from "@/views/content/ProductView";
import { CommandView } from "@/views/content/CommandView";
import { InvoiceView } from "@/views/content/InvoiceView";
import { ClientIndex } from "@/views/content/ClientIndex";
import { SellerIndex } from "@/views/content/SellerIndex";
import { SellerView } from "@/views/content/SellerView";
import { ClientView } from "@/views/content/ClientView";
import { StockView } from "@/views/content/StockView";
import { StatsView } from "@/views/content/StatsView";
import { CrediView } from "@/views/content/CrediView";
import { HomeView } from "@/views/content/HomeView";
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
