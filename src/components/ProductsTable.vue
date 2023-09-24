<script setup lang="ts">
import { globalTranslate } from "@/utils/globalTranslate";
import { store } from "@/store";
import UiPagination from "./ui/UiPagination.vue";
import { Checkbox } from "./ui/checkbox";
import UiIcon from "./ui/UiIcon.vue";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import type { productT } from "@/types";

defineProps<{ products: productT[] }>();

const toggleThisProduct = (product: productT, name: string) => {
  store.setters.updateStore({ key: "row", value: product });
  store.setters.updateStore({ key: "name", value: name });
  store.setters.updateStore({ key: "show", value: true });
};

const handleCheck = (product: productT, isChecked: boolean) => {
  console.log(product.name, isChecked ? "is checked" : "is unchecked");
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
          <th class="p-2 w-fit"></th>
          <th
            v-for="index in [1, 2, 3, 4, 5, 6]"
            :key="index"
            class="p-2 w-fit last:rounded-r-[4px]"
          >
            <div class="font-semibold text-left">
              {{ globalTranslate(`Products.index.feilds[${index}]`) }}
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
              <Checkbox />
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
                class="rounded-full w-full h-full object-fill animate-pulse bg-slate-300 duration-150"
              />
            </div>
          </td>
          <td class="p-2">
            <div class="font-medium text-gray-800">{{ product.name }}</div>
          </td>
          <td class="p-2">
            <div class="font-medium text-gray-800">
              {{ product.description }}
            </div>
          </td>
          <td class="p-2">
            <div class="text-left">{{ product.price.toFixed(2) }} DH</div>
          </td>
          <td class="p-2">
            <div class="text-left">{{ product.tva.toFixed(2) }} %</div>
          </td>
          <td class="p-2">
            <div class="text-left">{{ product?.quantity }} item</div>
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
      <UiPagination />
    </div>
  </div>
</template>
