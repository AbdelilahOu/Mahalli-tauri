<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import type { ProductT } from "@/schemas/products.schema";
import { store } from "@/store";
import { cn } from "@/utils/shadcn";
import {
  CalendarDays,
  FilePenLine,
  GripHorizontal,
  Info,
  PackagePlus,
  Trash2,
} from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import UiPagination from "./ui/UiPagination.vue";
import { Badge } from "./ui/badge";

defineProps<{ products: ProductT[] }>();

const { t, d } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();

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

const updateProductStock = (id: string, name: string) => {
  updateQueryParams({
    id,
    name,
  });
  store.setters.updateStore({ key: "name", value: "InventoryUpdate" });
  store.setters.updateStore({ key: "show", value: true });
};
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th class="small"></th>
          <th class="w-20">{{ t("g.fields.name") }}</th>
          <th class="small">{{ t("g.fields.inventory") }}</th>
          <th>{{ t("g.fields.threshold") }}</th>
          <th>{{ t("g.fields.price") }}</th>
          <th class="small">{{ t("g.fields.actions") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(product, index) in products"
          :key="product.id"
          v-fade="index"
        >
          <td class="p-2 flex justify-center">
            <Avatar>
              <AvatarImage :src="product.image ?? ''" />
              <AvatarFallback class="text-xs">
                {{ product.name.substring(0, 5) }}
              </AvatarFallback>
            </Avatar>
          </td>
          <td class="p-2">
            <span class="whitespace-nowrap flex justify-between gap-3">
              {{ product.name }}
              <HoverCard>
                <HoverCardTrigger as-child>
                  <Info class="cursor-pointer text-gray-800" :size="20" />
                </HoverCardTrigger>
                <HoverCardContent class="w-80">
                  <div class="flex justify-between space-x-4">
                    <div class="space-y-1">
                      <h4 class="text-sm font-semibold">
                        {{ product.name }}
                      </h4>
                      <p class="text-sm">
                        {{ product.description ?? "" }}
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
            </span>
          </td>
          <td class="p-2">
            <Badge
              variant="outline"
              :class="
                cn(
                  'whitespace-nowrap',
                  product.stock != undefined
                    ? product?.stock <= 0
                      ? 'bg-red-100 border-red-500 text-red-900'
                      : product?.stock < product.minQuantity
                        ? 'bg-yellow-100 border-yellow-500 text-yellow-900'
                        : product?.stock >= product.minQuantity
                          ? 'bg-green-100 border-green-500 text-green-900'
                          : ''
                    : '',
                )
              "
            >
              {{ t("g.plrz.i", { n: product?.stock }) }}
            </Badge>
          </td>
          <td class="p-2">
            {{ t("g.plrz.i", { n: product.minQuantity }) }}
          </td>
          <td class="p-2">{{ product.price.toFixed(2) }} DH</td>

          <td class="p-2">
            <div class="flex justify-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <GripHorizontal class="text-slate-800 inline" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <!-- <DropdownMenuLabel>My Account</DropdownMenuLabel> -->
                  <DropdownMenuItem
                    @click="toggleThisProduct(product, 'ProductDelete')"
                  >
                    <Trash2 class="text-red-500 inline mr-2" :size="20" />
                    <span>
                      <span class="text-red-500">
                        {{ t("g.actions.delete") }}
                      </span>
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    @click="toggleThisProduct(product, 'ProductUpdate')"
                  >
                    <FilePenLine
                      class="text-slate-800 inline mr-2"
                      :size="20"
                    />
                    {{ t("g.actions.edit") }}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    @click="updateProductStock(product.id!, product.name!)"
                  >
                    <PackagePlus
                      :size="20"
                      class="text-slate-800 inline mr-2"
                    />
                    {{ t("g.actions.inventoryUpdate") }}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <UiPagination v-if="products.length" />
  </div>
</template>
