<script setup lang="ts">
import { useI18n } from "vue-i18n";
import UiPagination from "./ui/UiPagination.vue";
import { FilePenLine, GripHorizontal, Trash2 } from "lucide-vue-next";
import { store } from "@/store";
import type { SupplierT } from "@/schemas/supplier.schema";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const toggleSupplierProfile = (supplier: SupplierT) => {
  updateQueryParams({
    id: supplier.id,
    fullname: supplier.fullname,
    email: supplier.email,
    phoneNumber: supplier.phoneNumber,
    address: supplier.address,
  });
};
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th class="small"></th>
          <th>{{ t("g.fields.fullname") }}</th>
          <th>{{ t("g.fields.email") }}</th>
          <th>{{ t("g.fields.phone") }}</th>
          <th>{{ t("g.fields.address") }}</th>
          <th class="small">{{ t("g.fields.actions") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(supplier, index) in suppliers"
          v-fade="index"
          :key="supplier.id"
        >
          <td class="p-2 flex justify-center">
            <Avatar>
              <AvatarImage :src="supplier.image ?? ''" />
              <AvatarFallback class="text-xs">
                {{ supplier.fullname.substring(0, 5) }}
              </AvatarFallback>
            </Avatar>
          </td>
          <td class="p-2 whitespace-nowrap font-medium">
            {{ supplier?.fullname }}
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
            <div class="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <GripHorizontal class="text-slate-800 inline" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    @click="toggleThisSupplier(supplier, 'supplierDelete')"
                  >
                    <Trash2 :size="20" class="text-red-500 inline mr-2" />
                    <span class="text-red-500">
                      {{ t("g.actions.delete") }}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    @click="toggleThisSupplier(supplier, 'supplierUpdate')"
                  >
                    <FilePenLine
                      :size="20"
                      class="text-slate-800 inline mr-2"
                    />
                    {{ t("g.actions.edit") }}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <!-- <SheetTrigger @click="(e) => toggleSupplierProfile(supplier)">
                <BookUser class="text-gray-800" :size="20" />
              </SheetTrigger> -->
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <UiPagination />
  </div>
</template>
