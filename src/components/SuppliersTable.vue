<script setup lang="ts">
import { useI18n } from "vue-i18n";
import UiPagination from "./ui/UiPagination.vue";
import { RouterLink } from "vue-router";
import { FilePenLine, BookUser, Trash2 } from "lucide-vue-next";
import { store } from "@/store";
import type { SupplierT } from "@/schemas/supplier.schema";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

defineProps<{
  suppliers: SupplierT[];
}>();

const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();

const toggleThisSupplier = (supplier: SupplierT, name: string) => {
  updateQueryParams({
    id: supplier.id,
    fullname: supplier.fullname,
    email: supplier.email,
    phoneNumber: supplier.phoneNumber,
    address: supplier.address,
  });
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
        <tr>
          <th class="rounded-l-md w-20"></th>
          <th class="p-2 w-fit font-semibold text-left">
            {{ t("g.fields.fullname") }}
          </th>
          <th class="p-2 w-fit font-semibold text-left">
            {{ t("g.fields.email") }}
          </th>
          <th class="p-2 w-fit font-semibold text-left">
            {{ t("g.fields.phone") }}
          </th>
          <th class="p-2 w-fit font-semibold text-left">
            {{ t("g.fields.address") }}
          </th>
          <th class="rounded-r-md">
            {{ t("g.fields.actions") }}
          </th>
        </tr>
      </thead>
      <tbody class="text-sm divide-y divide-gray-100">
        <tr
          v-fade="index"
          v-for="(supplier, index) in suppliers"
          :key="supplier.id"
        >
          <td class="p-1 flex justify-center">
            <Avatar>
              <AvatarImage :src="supplier.image ?? ''" />
              <AvatarFallback class="text-xs">
                {{ supplier.fullname.substring(0, 5) }}
              </AvatarFallback>
            </Avatar>
          </td>
          <td class="p-2 font-medium">
            {{ supplier.fullname }}
          </td>
          <td class="p-2">
            {{ supplier.email }}
          </td>
          <td class="p-2">
            {{ supplier.phoneNumber }}
          </td>
          <td class="p-2">
            {{ supplier.address }}
          </td>
          <td class="p-2">
            <div class="flex w-full justify-center gap-3">
              <Trash2
                @click="toggleThisSupplier(supplier, 'SupplierDelete')"
                class="cursor-pointer"
                :size="22"
              />
              <FilePenLine
                @click="toggleThisSupplier(supplier, 'SupplierUpdate')"
                class="cursor-pointer"
                :size="22"
              />
              <RouterLink
                :to="{
                  path: '/suppliers/' + supplier.id,
                }"
              >
                <BookUser :size="22" />
              </RouterLink>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pt-12">
      <UiPagination />
    </div>
  </div>
</template>
