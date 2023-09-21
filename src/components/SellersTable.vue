<script setup lang="ts">
import { ref } from "vue";
import { globalTranslate } from "@/utils/globalTranslate";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { store } from "@/store";
import { Checkbox } from "./ui/checkbox";
import UiIcon from "./ui/UiIcon.vue";
import UiPagination from "./ui/UiPagination.vue";
import { RouterLink } from "vue-router";
import type { sellerT } from "@/types";

const checkedSellers = ref<number[]>([]);

defineProps<{
  sellers: sellerT[];
}>();

const checkThisUser = (IsInclude: boolean, id: number) => {
  IsInclude
    ? checkedSellers.value.push(id)
    : checkedSellers.value.splice(checkedSellers.value.indexOf(id), 1);
};

const toggleThisSeller = (seller: sellerT, name: string) => {
  store.setters.updateStore({ key: "row", value: seller });
  store.setters.updateStore({ key: "name", value: name });
  store.setters.updateStore({ key: "show", value: true });
};
</script>

<template>
  <div class="flex flex-col w-full">
    <table class="table-auto w-full">
      <thead
        class="text-xs h-9 font-semibold uppercase text-[rgba(25,23,17,0.6)] bg-gray-300"
      >
        <tr class="">
          <th class="rounded-l-[4px]"></th>
          <th class=""></th>
          <th
            v-for="index in [0, 1, 2, 3, 4]"
            class="p-2 w-fit last:rounded-r-[4px]"
          >
            <div class="font-semibold text-left">
              {{ globalTranslate(`Sellers.index.feilds[${index}]`) }}
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="text-sm divide-y divide-gray-100">
        <tr v-fade="index" v-for="(seller, index) in sellers" :key="seller.id">
          <td class="p-2">
            <span class="h-full w-full grid">
              <Checkbox />
            </span>
          </td>
          <td class="p-2">
            <div class="w-12 h-12 rounded-full overflow-hidden">
              <img
                v-if="seller.image && seller.image !== ''"
                class="rounded-full w-full h-full object-cover"
                :src="convertFileSrc(seller.image)"
              />
              <span
                v-else
                class="rounded-full w-full h-full object-fill animate-pulse bg-slate-300 duration-150"
              />
            </div>
          </td>
          <td class="p-2">
            <div class="font-medium text-gray-800">{{ seller.name }}</div>
          </td>
          <td class="p-2">
            <div class="text-left whitespace-nowrap overflow-ellipsis">
              <span v-if="!seller.email" class="text-red-400">No email</span>
              <span v-else>
                {{ seller.email }}
              </span>
            </div>
          </td>
          <td class="p-2">
            <div class="text-left whitespace-nowrap overflow-ellipsis">
              <span v-if="!seller.phone" class="text-red-400">No phone</span>
              <span v-else>{{ seller.phone }}</span>
            </div>
          </td>
          <td class="p-2">
            <div class="text-left whitespace-nowrap overflow-ellipsis">
              <span v-if="!seller.address" class="text-red-400"
                >No address</span
              >
              <span v-else>{{ seller.address }}</span>
            </div>
          </td>
          <td class="p-2">
            <div class="flex w-full justify-start gap-3">
              <span @click="() => toggleThisSeller(seller, 'SellerDelete')">
                <UiIcon name="delete" />
              </span>
              <span @click="() => toggleThisSeller(seller, 'SellerUpdate')">
                <UiIcon name="edit" />
              </span>
              <RouterLink
                :to="{ name: 'SellerDetails', params: { id: seller.id } }"
              >
                <UiIcon name="more" />
              </RouterLink>
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
