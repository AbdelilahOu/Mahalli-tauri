<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const pages = ref([
  {
    image: "/clients.jpg",
    text: "Clients",
    path: "/Clients/all",
  },
  {
    image: "/products.jpg",
    text: "Products",
    path: "/Products",
  },
  {
    image: "/sellers.jpeg",
    text: "Sellers",
    path: "/Sellers/all",
  },
  {
    image: "/orders.jpg",
    text: "Orders",
    path: "/Orders/all",
  },
  {
    image: "/invoices.jpg",
    text: "Invoices",
    path: "/Invoices/all",
  },
  {
    image: "/inventory.jpg",
    text: "Inventory",
    path: "/Inventory",
  },
  {
    image: "/stats.jpg",
    text: "Statistics",
    path: "/Stats",
  },
]);
</script>

<template>
  <main class="w-full h-full">
    <div class="w-full h-full flex justify-center items-center flex-col">
      <div
        class="grid grid-rows-[1fr_46px] max-w-3xl max-h-[48rem] w-full h-full grid-cols-[1fr_48px]"
      >
        <div
          class="md:h-[700px] w-full h-full p-3 gap-3 grid-cols-3 grid-rows-3 grid"
        >
          <div
            v-fade="index + 1"
            class="w-full h-full"
            v-for="(page, index) in pages"
            :key="index"
          >
            <RouterLink :to="{ path: page.path, query: { page: 1 } }">
              <div
                class="w-full h-full overflow-hidden cursor-pointer relative hover:-translate-y-1 group transition-all duration-250 flex justify-center rounded-[4px] items-center bg-gray-400"
              >
                <img
                  class="absolute top-0 left-0 w-full opacity-20 group-hover:opacity-60 h-full transition-all duration-250"
                  :src="page.image"
                  alt=""
                />
                <span
                  class="text-center text-xl text-gray-900 font-bold bg-white rounded-[4px] px-4 z-20 py-2 flex justify-center items-center transition-all duration-250"
                >
                  {{ t(`g.r.${page.text}`) }}
                </span>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
