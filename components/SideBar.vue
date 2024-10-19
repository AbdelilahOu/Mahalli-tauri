<script setup lang="ts">
import {
  Container,
  BarChart3Icon,
  SquareUser,
  HomeIcon,
  Languages,
  ReceiptText,
  Package,
  Quote,
  Store,
  Truck,
} from "lucide-vue-next";
import { TranslationModal } from "#components";

const { t, locale } = useI18n();
const localePath = useLocalePath();
const modal = useModal();

const LOCALE_TEXT = {
  en: "English",
  fr: "Francais",
  ar: "العربية",
  de: "Deutsch",
} as const;

const openTranslationModal = () => modal.open(TranslationModal, {});

const hoveredItem = ref<string | null>(null);

const menuItems = [
  { icon: HomeIcon, label: "routes.home", path: "/" },
  {
    icon: SquareUser,
    label: "routes.clients",
    path: "/clients/",
    query: { page: 1, limit: 25 },
  },
  {
    icon: Package,
    label: "routes.products",
    path: "/products/",
    query: { page: 1 },
  },
  {
    icon: Quote,
    label: "routes.quotes",
    path: "/quotes/",
    query: { page: 1 },
  },
  {
    icon: Truck,
    label: "routes.orders",
    path: "/orders/",
    query: { page: 1 },
  },
  {
    icon: ReceiptText,
    label: "routes.invoices",
    path: "/invoices/",
    query: { page: 1 },
  },
  {
    icon: Container,
    label: "routes.inventory",
    path: "/inventory/",
    query: { page: 1 },
  },
  { icon: BarChart3Icon, label: "routes.dashboard", path: "/dashboard" },
];
</script>

<template>
  <aside
    class="w-12 min-w-[48px] transition-all print:hidden sticky h-screen top-0 border-x border-slate-100 z-50 flex justify-center bg-white"
  >
    <div class="w-full h-screen sticky top-0 z-50 flex flex-col gap-1">
      <div
        class="w-full min-h-[51px] border-b border-slate-100 flex items-center justify-center"
      >
        <Store :size="20" class="text-primary" />
      </div>
      <div class="w-full px-1 flex flex-col justify-between h-full pb-2">
        <div class="w-full h-full flex flex-col gap-1">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.path"
            class="w-full flex flex-nowrap h-9 rounded-md items-center justify-center p-1 group transition-all duration-300 relative hover:bg-gray-50"
            :to="localePath({ path: item.path, query: item.query })"
            @mouseenter="hoveredItem = item.label"
            @mouseleave="hoveredItem = null"
          >
            <component
              :is="item.icon"
              class="m-auto text-gray-700 group-hover:text-primary"
              :size="20"
            />

            <Transition name="fade">
              <div
                v-if="hoveredItem === item.label"
                class="absolute left-full rtl:right-full w-fit ml-2 rtl:mr-2 bg-white border border-gray-200 rounded-md shadow-md px-3 py-2 whitespace-nowrap"
              >
                <span class="text-sm font-medium text-gray-700">{{
                  t(item.label)
                }}</span>
              </div>
            </Transition>
          </NuxtLink>
        </div>
        <div
          class="cursor-pointer w-full flex h-9 rounded-md items-center justify-center p-1 group transition-all duration-300 relative hover:bg-gray-50"
          @click="openTranslationModal"
          @mouseenter="hoveredItem = 'language'"
          @mouseleave="hoveredItem = null"
        >
          <Languages
            class="m-auto text-gray-700 group-hover:text-primary"
            :size="20"
          />

          <Transition name="fade">
            <div
              v-if="hoveredItem === 'language'"
              class="absolute left-full ml-2 bg-white border border-gray-200 rounded-md shadow-md px-3 py-2 whitespace-nowrap"
            >
              <span class="text-sm font-medium text-gray-700">{{
                LOCALE_TEXT[locale]
              }}</span>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.router-link-active {
  @apply bg-white transition-colors rounded-md transform duration-200;
}

.router-link-active > svg {
  @apply text-black;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
