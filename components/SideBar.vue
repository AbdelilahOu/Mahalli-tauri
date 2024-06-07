<script setup lang="ts">
//
import {
  Archive,
  BarChartBig,
  ChevronsLeft,
  Languages,
  NotepadText,
  Package,
  Settings,
  Truck,
  Contact,
  Quote,
  Store,
} from "lucide-vue-next";

const collapse = defineModel<boolean>("collapse", { required: true });
const { t, locale } = useI18n();
const localePath = useLocalePath();

const LOCALE_TEXT = {
  en: "English",
  fr: "Francais",
  ar: "العربية",
  de: "Deutsch",
} as const;

const openTranslationModal = () => {
  store.setters.updateStore({ key: "show", value: true });
  store.setters.updateStore({ key: "name", value: "TranslationModal" });
};
</script>

<template>
  <aside class="w-full h-screen sticky top-0 z-50 flex flex-col gap-3 bg-white">
    <div class="w-full min-h-[51px] border-b border-slate-100">
      <div
        :class="
          cn(
            'font-medium flex h-full items-center px-1',
            collapse ? 'justify-around' : 'justify-between'
          )
        "
      >
        <span
          v-if="!collapse"
          class="whitespace-nowrap flex items-center gap-2 pl-2 font-semibold text-base text-primary overflow-hidden"
        >
          <Store :size="20" class="text-primary inline shrink-0 m-auto" />
          Mahalli
        </span>
        <ChevronsLeft
          @click="collapse = !collapse"
          :size="20"
          :class="{
            'rotate-180': collapse,
            'transition-all duration-200 cursor-pointer transform': true,
          }"
        />
      </div>
    </div>
    <div class="w-full px-1 flex flex-col justify-around h-full pb-2">
      <div class="w-full h-full flex flex-col gap-1">
        <NuxtLink
          class="w-full flex flex-nowrap h-9 rounded-md items-center p-1 group transition-all duration-300"
          :to="localePath({ path: '/clients/', query: { page: 1 } })"
        >
          <span class="w-[30px] shrink-0">
            <Contact
              class="m-auto text-gray-700 group-hover:text-black"
              :size="20"
            />
          </span>
          <span
            v-if="!collapse"
            class="text-gray-500 text-nowrap overflow-hidden ml-1 text-sm group-hover:text-primary font-medium"
          >
            {{ t("g.r.Clients") }}
          </span>
        </NuxtLink>
        <NuxtLink
          class="w-full flex h-9 rounded-md items-center p-1 group transition-all duration-300"
          :to="localePath({ path: '/products/', query: { page: 1 } })"
        >
          <span class="w-[30px] shrink-0">
            <Package
              class="m-auto text-gray-700 group-hover:text-black"
              :size="20"
            />
          </span>
          <span
            v-if="!collapse"
            class="text-gray-500 text-nowrap overflow-hidden ml-1 text-sm group-hover:text-primary font-medium"
          >
            {{ t("g.r.Products") }}
          </span>
        </NuxtLink>
        <NuxtLink
          class="w-full flex h-9 rounded-md items-center p-1 group transition-all duration-300"
          :to="localePath({ path: '/quotes/', query: { page: 1 } })"
        >
          <span class="w-[30px] shrink-0">
            <Quote
              class="m-auto text-gray-700 group-hover:text-black"
              :size="20"
            />
          </span>
          <span
            v-if="!collapse"
            class="text-gray-500 text-nowrap overflow-hidden ml-1 text-sm group-hover:text-primary font-medium"
          >
            {{ t("g.r.Quotes") }}
          </span>
        </NuxtLink>
        <NuxtLink
          class="w-full flex h-9 rounded-md items-center p-1 group transition-all duration-300"
          :to="localePath({ path: '/orders/', query: { page: 1 } })"
        >
          <span class="w-[30px] shrink-0">
            <Truck
              class="m-auto text-gray-700 group-hover:text-black"
              :size="20"
            />
          </span>
          <span
            v-if="!collapse"
            class="text-gray-500 text-nowrap overflow-hidden ml-1 text-sm group-hover:text-primary font-medium"
          >
            {{ t("g.r.Orders") }}
          </span>
        </NuxtLink>
        <NuxtLink
          class="w-full flex h-9 rounded-md items-center p-1 group transition-all duration-300"
          :to="localePath({ path: '/invoices/', query: { page: 1 } })"
        >
          <span class="w-[30px] shrink-0">
            <NotepadText
              class="m-auto text-gray-700 group-hover:text-black"
              :size="20"
            />
          </span>
          <span
            v-if="!collapse"
            class="text-gray-500 text-nowrap overflow-hidden ml-1 text-sm group-hover:text-primary font-medium"
          >
            {{ t("g.r.Invoices") }}
          </span>
        </NuxtLink>
        <NuxtLink
          class="w-full flex h-9 rounded-md items-center p-1 group transition-all duration-300"
          :to="localePath({ path: '/inventory/', query: { page: 1 } })"
        >
          <span class="w-[30px] shrink-0">
            <Archive
              class="m-auto text-gray-700 group-hover:text-black"
              :size="20"
            />
          </span>
          <span
            v-if="!collapse"
            class="text-gray-500 text-nowrap overflow-hidden ml-1 text-sm group-hover:text-primary font-medium"
          >
            {{ t("g.r.Inventory") }}
          </span>
        </NuxtLink>
        <NuxtLink
          class="w-full flex h-9 rounded-md items-center p-1 group transition-all duration-300"
          :to="localePath({ path: '/dashboard' })"
        >
          <span class="w-[30px] shrink-0">
            <BarChartBig
              class="m-auto text-gray-700 group-hover:text-black"
              :size="20"
            />
          </span>
          <span
            v-if="!collapse"
            class="text-gray-500 text-nowrap overflow-hidden ml-1 text-sm group-hover:text-primary font-medium"
          >
            {{ t("g.r.Dashboard") }}
          </span>
        </NuxtLink>
      </div>
      <div
        class="cursor-pointer w-full flex h-9 rounded-md items-center p-1 group transition-all duration-300"
        @click="openTranslationModal"
      >
        <span class="w-[30px] shrink-0">
          <Languages
            class="m-auto text-gray-700 group-hover:text-black"
            :size="20"
          />
        </span>
        <span
          v-if="!collapse"
          class="text-gray-500 text-nowrap overflow-hidden ml-1 text-sm group-hover:text-primary font-medium"
        >
          {{
            //@ts-ignore
            LOCALE_TEXT[locale]
          }}
        </span>
      </div>
    </div>
  </aside>
</template>
