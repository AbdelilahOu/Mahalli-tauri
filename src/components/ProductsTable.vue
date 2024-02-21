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

defineProps<{ products: ProductT[] }>();

const { t } = useI18n();

const checkedProducts = ref<string[]>([]);

const toggleThisProduct = (product: ProductT, name: string) => {
  store.setters.updateStore({ key: "row", value: product });
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
  <div class="w-full flex flex-col gap-10">
    <table class="table-auto w-full">
      <thead
        class="text-xs h-9 font-semibold uppercase text-[rgba(25,23,17,0.6)] bg-gray-300"
      >
        <tr>
          <th class="rounded-l-[4px]"></th>
          <th class="p-2 w-fit"></th>
          <th
            v-for="index in [1, 2, 3, 5, 6]"
            :key="index"
            class="p-2 w-fit last:rounded-r-[4px]"
          >
            <div class="font-semibold text-left">
              {{ t(`p.i.feilds[${index}]`) }}
            </div>
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
              <img
                v-if="product.image && product.image !== ''"
                class="rounded-full w-full h-full object-cover"
                :src="convertFileSrc(product.image)"
                alt=""
              />
              <span
                v-else
                class="rounded-full w-full h-full block object-fill animate-pulse bg-slate-300 duration-1000"
              />
            </div>
          </td>
          <td class="p-2">
            <div class="font-medium text-gray-800">{{ product.name }}</div>
          </td>
          <td class="p-2">
            <div class="font-medium text-gray-800">
              {{ product.description?.substring(0, 50) + "..." }}
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
    <div>
      <UiPagination v-if="products.length" />
    </div>
  </div>
</template>
