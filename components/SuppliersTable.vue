<script setup lang="ts">
import { FilePenLine, GripHorizontal, Trash2 } from "lucide-vue-next";
import type { SupplierT } from "@/schemas/supplier.schema";

defineProps<{
  suppliers: SupplierT[];
}>();

const { t, locale } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();
const { setModalName, toggleModal } = useStore();

const toggleThisSupplier = (supplier: SupplierT, name: string) => {
  updateQueryParams({
    id: supplier.id,
    fullname: supplier.fullname,
    email: supplier.email,
    phoneNumber: supplier.phoneNumber,
    address: supplier.address,
  });
  setModalName(name);
  toggleModal(true);
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
  <div class="w-full">
    <Table :dir="locale == 'ar' ? 'rtl' : 'ltr'">
      <TableHeader>
        <TableRow>
          <TableHead class="w-14" />
          <TableHead>{{ t("g.fields.fullname") }}</TableHead>
          <TableHead>{{ t("g.fields.email") }}</TableHead>
          <TableHead>{{ t("g.fields.phone") }}</TableHead>
          <TableHead>{{ t("g.fields.address") }}</TableHead>
          <TableHead class="w-20">{{ t("g.fields.actions") }}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="(supplier, index) in suppliers"
          :key="supplier.id"
          v-fade="index"
        >
          <TableCell class="p-2 flex justify-center">
            <Avatar>
              <AvatarImage :src="supplier.image ?? ''" />
              <AvatarFallback class="text-xs">
                {{ supplier.fullname.substring(0, 5) }}
              </AvatarFallback>
            </Avatar>
          </TableCell>
          <TableCell class="p-2 whitespace-nowrap font-medium">
            {{ supplier?.fullname }}
          </TableCell>
          <TableCell class="p-2">
            {{ supplier.email }}
          </TableCell>
          <TableCell class="p-2">
            {{ supplier.phoneNumber }}
          </TableCell>
          <TableCell class="p-2">
            {{ supplier.address }}
          </TableCell>
          <TableCell class="p-2">
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
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <Pagination />
  </div>
</template>
