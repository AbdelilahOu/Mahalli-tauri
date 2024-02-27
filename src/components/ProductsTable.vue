<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import UiPagination from "./ui/UiPagination.vue";
import { Checkbox } from "./ui/checkbox";
import UiIcon from "./ui/UiIcon.vue";
import { store } from "@/store";
import type { ProductT } from "@/schemas/products.schema";
import { Badge } from "./ui/badge";
import { cn } from "@/utils/shadcn";
import { ref } from "vue";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CalendarDays } from "lucide-vue-next";
import { Skeleton } from "./ui/skeleton";

defineProps<{ products: ProductT[] }>();

const { t, d } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();

const checkedProducts = ref<string[]>([]);

const toggleThisProduct = (product: ProductT, name: string) => {
  updateQueryParams({
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description,
    minQuantity: product.minQuantity,
  });
  store.setters.updateStore({ key: "name", value: name });
  store.setters.updateStore({ key: "show", value: true });
};

const checkThisProduct = (IsInclude: boolean, id: string) => {
  IsInclude
    ? checkedProducts.value.push(id)
    : checkedProducts.value.splice(checkedProducts.value.indexOf(id), 1);
};
</script>

<template>
  <div class="w-full flex flex-col">
    <table class="table-auto w-full">
      <thead
        class="text-xs h-9 font-semibold uppercase text-[rgba(25,23,17,0.6)] bg-gray-300"
      >
        <tr>
          <th class="rounded-l-[4px]"></th>
          <th class="p-2"></th>
          <th class="p-2 w-fit font-semibold text-left">
            {{ t("g.fields.name") }}
          </th>
          <th class="p-2 w-fit font-semibold text-left">
            {{ t("g.fields.description") }}
          </th>
          <th class="p-2 w-fit font-semibold text-left">
            {{ t("g.fields.price") }}
          </th>
          <th class="p-2 w-fit font-semibold text-left">
            {{ t("g.fields.inventory") }}
          </th>
          <th class="rounded-r-[4px]">
            {{ t("g.fields.actions") }}
          </th>
        </tr>
      </thead>
      <tbody class="text-sm divide-y divide-gray-100">
        <tr
          v-for="(product, index) in products"
          :key="product.id"
          v-fade="index"
        >
          <td class="p-2">
            <span class="h-full w-full grid">
              <Checkbox
                :checked="checkedProducts.includes(product.id!)"
                @update:checked="(a) => checkThisProduct(a, product.id!)"
              />
            </span>
          </td>
          <td class="p-2">
            <div class="w-12 h-12 rounded-full overflow-hidden">
              <Skeleton
                class="rounded-full w-full h-full block object-fill animate-pulse bg-slate-300 duration-1000"
              >
                <img
                  v-if="product.image && product.image !== ''"
                  class="rounded-full w-full h-full object-cover"
                  :src="convertFileSrc(product.image)"
                  alt=""
                />
              </Skeleton>
            </div>
          </td>
          <td class="p-2">
            <div class="font-medium text-gray-800">{{ product.name }}</div>
          </td>
          <td class="p-2">
            <div
              v-if="product.description && product.description?.length > 30"
              class="font-medium text-gray-800 flex items-center"
            >
              {{ product.description?.substring(0, 30) }}...
              <HoverCard>
                <HoverCardTrigger as-child>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="bg-slate-200 h-fit px-[2px]"
                    >more
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent class="w-80">
                  <div class="flex justify-between space-x-4">
                    <div class="space-y-1">
                      <h4 class="text-sm font-semibold">
                        {{ product.name }}
                      </h4>
                      <p class="text-sm">
                        {{ product.description }}
                      </p>
                      <div class="flex items-center pt-2">
                        <CalendarDays class="mr-2 h-4 w-4 opacity-70" />
                        <span class="text-xs text-muted-foreground">
                          Created at {{ d(product.createdAt!, "short") }}
                        </span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            <div v-else class="font-medium text-gray-800 flex items-center">
              {{ product.description }}
            </div>
          </td>
          <td class="p-2">
            <div class="text-left">{{ product.price.toFixed(2) }} DH</div>
          </td>
          <td class="p-2">
            <div class="text-left">
              <Badge
                variant="outline"
                :class="
                  cn(
                    product.stock != undefined
                      ? product?.stock < 0
                        ? 'bg-red-100 border-red-500 text-red-900'
                        : product?.stock < product.minQuantity
                          ? 'bg-yellow-100 border-yellow-500 text-yellow-900'
                          : product?.stock > product.minQuantity
                            ? 'bg-green-100 border-green-500 text-green-900'
                            : ''
                      : '',
                  )
                "
              >
                {{ t("g.plrz.i", { n: product?.stock }) }}
              </Badge>
            </div>
          </td>
          <td class="p-2">
            <div class="flex justify-start gap-3">
              <span @click="toggleThisProduct(product, 'ProductDelete')">
                <UiIcon isStyled name="delete" />
              </span>
              <span @click="toggleThisProduct(product, 'ProductUpdate')">
                <UiIcon isStyled name="edit" />
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pt-12">
      <UiPagination v-if="products.length" />
    </div>
  </div>
</template>
