<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import UiPagination from "./ui/UiPagination.vue";
import { Checkbox } from "./ui/checkbox";
import { RouterLink } from "vue-router";
import UiIcon from "./ui/UiIcon.vue";
import { store } from "@/store";
import { ref } from "vue";
import type { SupplierT } from "@/schemas/supplier.schema";

defineProps<{
  suppliers: SupplierT[];
}>();

const { t } = useI18n();

const checkedSuppliers = ref<string[]>([]);

const checkThisSupplier = (IsInclude: boolean, id: string) => {
  IsInclude
    ? checkedSuppliers.value.push(id)
    : checkedSuppliers.value.splice(checkedSuppliers.value.indexOf(id), 1);
};

const toggleThisSupplier = (supplier: SupplierT, name: string) => {
  store.setters.updateStore({ key: "row", value: supplier });
  store.setters.updateStore({ key: "name", value: name });
  store.setters.updateStore({ key: "show", value: true });
};
</script>

<template>
  <div class="flex flex-col w-full gap-10">
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
              {{ t(`s.i.feilds[${index}]`) }}
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="text-sm divide-y divide-gray-100">
        <tr
          v-fade="index"
          v-for="(supplier, index) in suppliers"
          :key="supplier.id"
        >
          <td class="p-2">
            <span class="h-full w-full grid">
              <Checkbox
                :checked="checkedSuppliers.includes(supplier.id!)"
                @update:checked="(a) => checkThisSupplier(a, supplier.id!)"
              />
            </span>
          </td>
          <td class="p-2">
            <div class="w-12 h-12 rounded-full overflow-hidden">
              <img
                v-if="supplier.image && supplier.image !== ''"
                class="rounded-full w-full h-full object-cover"
                :src="convertFileSrc(supplier.image)"
              />
              <span
                v-else
                class="rounded-full w-full h-full block object-fill animate-pulse bg-slate-300 duration-1000"
              />
            </div>
          </td>
          <td class="p-2">
            <div class="font-medium text-gray-800">{{ supplier.fullname }}</div>
          </td>
          <td class="p-2">
            <div class="text-left whitespace-nowrap overflow-ellipsis">
              <span v-if="!supplier.email" class="text-red-400">No email</span>
              <span v-else>
                {{ supplier.email }}
              </span>
            </div>
          </td>
          <td class="p-2">
            <div class="text-left whitespace-nowrap overflow-ellipsis">
              <span v-if="!supplier.phoneNumber" class="text-red-400"
                >No phone</span
              >
              <span v-else>{{ supplier.phoneNumber }}</span>
            </div>
          </td>
          <td class="p-2">
            <div class="text-left whitespace-nowrap overflow-ellipsis">
              <span v-if="!supplier.address" class="text-red-400"
                >No address</span
              >
              <span v-else>{{ supplier.address }}</span>
            </div>
          </td>
          <td class="p-2">
            <div class="flex w-full justify-start gap-3">
              <span @click="toggleThisSupplier(supplier, 'SupplierDelete')">
                <UiIcon isStyled name="delete" />
              </span>
              <span @click="toggleThisSupplier(supplier, 'SupplierUpdate')">
                <UiIcon isStyled name="edit" />
              </span>
              <RouterLink
                :to="{ name: 'SupplierDetails', params: { id: supplier.id } }"
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