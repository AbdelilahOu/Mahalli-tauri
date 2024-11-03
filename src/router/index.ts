import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("../pages/index.vue"),
    children: [
      {
        path: "/",
        name: "home",
        component: () => import("../pages/index/index.vue"),
      },
      {
        // Invoices routes
        path: "/invoices",
        name: "invoices",
        component: () => import("../pages/index/invoices/index.vue"),
      },
      {
        path: "/invoices/:id",
        name: "invoice-details",
        component: () => import("../pages/index/invoices/[id].vue"),
      },

      // Orders routes
      {
        path: "/orders",
        name: "orders",
        component: () => import("../pages/index/orders/index.vue"),
      },
      {
        path: "/orders/:id",
        name: "order-details",
        component: () => import("../pages/index/orders/[id].vue"),
      },

      // Quotes routes
      {
        path: "/quotes",
        name: "quotes",
        component: () => import("../pages/index/quotes/index.vue"),
      },
      {
        path: "/quotes/:id",
        name: "quote-details",
        component: () => import("../pages/index/quotes/[id].vue"),
      },

      // Suppliers routes
      {
        path: "/suppliers",
        name: "suppliers",
        component: () => import("../pages/index/suppliers/index.vue"),
      },
      {
        path: "/suppliers/:id",
        name: "supplier-details",
        component: () => import("../pages/index/suppliers/[id].vue"),
      },
      {
        path: "/clients",
        name: "clients",
        component: () => import("../pages/index/clients/index.vue"),
      },
      {
        path: "/clients/:id",
        name: "client-details",
        component: () => import("../pages/index/clients/[id].vue"),
      },

      // Other pages
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("../pages/index/dashboard.vue"),
      },
      {
        path: "/inventory",
        name: "inventory",
        component: () => import("../pages/index/inventory.vue"),
      },
      {
        path: "/products",
        name: "products",
        component: () => import("../pages/index/products.vue"),
      },
      {
        path: "/settings",
        name: "settings",
        component: () => import("../pages/index/settings.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
