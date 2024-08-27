<script setup lang="ts">
import { FilePenLine, GripHorizontal, Trash2 } from "lucide-vue-next";
// @ts-ignore
import { ClientDelete, ClientUpdate } from "#components";

defineProps<{
  clients: ClientT[];
}>();

const { t, locale, n } = useI18n();
const modal = useModal();

function toggleThisClient(client: ClientT, name: "delete" | "update") {
  if (name === "delete") {
    modal.open(ClientDelete, {
      id: client.id,
      fullName: client.fullName,
    });
  } else {
    modal.open(ClientUpdate, {
      id: client.id,
      fullName: client.fullName,
      email: client.email,
      phoneNumber: client.phoneNumber,
      address: client.address,
    });
  }
}
</script>

<template>
  <div class="w-full">
    <Table :dir="locale === 'ar' ? 'rtl' : 'ltr'">
      <TableHeader>
        <TableRow>
          <TableHead class="w-14" />
          <TableHead>{{ t("fields.full-name") }}</TableHead>
          <TableHead>{{ t("fields.email") }}</TableHead>
          <TableHead>{{ t("fields.phone") }}</TableHead>
          <TableHead>{{ t("fields.address") }}</TableHead>
          <TableHead>{{ t("fields.credit") }}</TableHead>
          <TableHead class="w-20">
            {{ t("fields.actions") }}
          </TableHead>
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
                {{ client.fullName.substring(0, 5) }}
              </AvatarFallback>
            </Avatar>
          </TableCell>
          <TableCell class="p-2 whitespace-nowrap font-medium">
            {{ client?.fullName }}
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
                <DropdownMenuContent class="rtl:ml-6 ltr:mr-6">
                  <DropdownMenuItem @click="toggleThisClient(client, 'update')">
                    <FilePenLine
                      :size="20"
                      class="text-slate-800 inline mr-2"
                    />
                    {{ t("actions.edit") }}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="toggleThisClient(client, 'delete')">
                    <Trash2 :size="20" class="text-red-500 inline mr-2" />
                    <span class="text-red-500">
                      {{ t("actions.delete") }}
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
