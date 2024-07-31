<script setup lang="ts">
import type { ClientT } from "@/schemas/client.schema";
import { FilePenLine, Trash2, GripHorizontal } from "lucide-vue-next";
// @ts-ignore
import { ClientUpdate, ClientDelete } from "#components";

defineProps<{
  clients: ClientT[];
}>();

const { t, locale, n } = useI18n();
const modal = useModal();

const toggleThisClient = (client: ClientT, name: "delete" | "update") => {
  if (name == "delete") {
    modal.open(ClientDelete, {
      id: client.id,
      fullname: client.fullname,
    });
  } else {
    modal.open(ClientUpdate, {
      id: client.id,
      fullname: client.fullname,
      email: client.email,
      phoneNumber: client.phoneNumber,
      address: client.address,
    });
  }
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
          <TableHead>{{ t("g.fields.creditt") }}</TableHead>
          <TableHead class="w-20">{{ t("g.fields.actions") }}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="(client, index) in clients"
          :key="client.id"
          v-fade="index"
        >
          <TableCell class="p-2 flex justify-center">
            <Avatar>
              <AvatarImage :src="client.image ?? ''" />
              <AvatarFallback class="text-xs">
                {{ client.fullname.substring(0, 5) }}
              </AvatarFallback>
            </Avatar>
          </TableCell>
          <TableCell class="p-2 whitespace-nowrap font-medium">
            {{ client?.fullname }}
          </TableCell>
          <TableCell class="p-2">
            {{ client.email }}
          </TableCell>
          <TableCell class="p-2">
            {{ client.phoneNumber }}
          </TableCell>
          <TableCell class="p-2">
            {{ client.address }}
          </TableCell>
          <TableCell class="p-2 whitespace-nowrap">
            {{ n(client.credit!, "decimal") }} DH
          </TableCell>
          <TableCell class="p-2">
            <div class="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <GripHorizontal class="text-slate-800 inline" />
                </DropdownMenuTrigger>
                <DropdownMenuContent :class="locale == 'ar' ? 'ml-6' : 'mr-6'">
                  <DropdownMenuItem @click="toggleThisClient(client, 'update')">
                    <FilePenLine
                      :size="20"
                      class="text-slate-800 inline mr-2"
                    />
                    {{ t("g.actions.edit") }}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="toggleThisClient(client, 'delete')">
                    <Trash2 :size="20" class="text-red-500 inline mr-2" />
                    <span class="text-red-500">
                      {{ t("g.actions.delete") }}
                    </span>
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
