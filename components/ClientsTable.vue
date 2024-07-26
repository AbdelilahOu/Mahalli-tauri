<script setup lang="ts">
import type { ClientT } from "@/schemas/client.schema";
import { FilePenLine, Trash2, GripHorizontal } from "lucide-vue-next";

defineProps<{
  clients: ClientT[];
}>();

const { t, locale, n } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();
const { setModalName, toggleModal } = useStore();

const toggleThisClient = (client: ClientT, name: string) => {
  updateQueryParams({
    id: client.id,
    fullname: client.fullname,
    email: client.email,
    phoneNumber: client.phoneNumber,
    address: client.address,
  });
  setModalName(name);
  toggleModal(true);
};
</script>

<template>
  <div>
    <table :dir="locale == 'ar' ? 'rtl' : 'ltr'">
      <thead>
        <tr>
          <th class="w-14" />
          <th>{{ t("g.fields.fullname") }}</th>
          <th>{{ t("g.fields.email") }}</th>
          <th>{{ t("g.fields.phone") }}</th>
          <th>{{ t("g.fields.address") }}</th>
          <th>{{ t("g.fields.creditt") }}</th>
          <th class="w-20">{{ t("g.fields.actions") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(client, index) in clients" :key="client.id" v-fade="index">
          <td class="p-2 flex justify-center">
            <Avatar>
              <AvatarImage :src="client.image ?? ''" />
              <AvatarFallback class="text-xs">
                {{ client.fullname.split(" ")[0].substring(3) }}
              </AvatarFallback>
            </Avatar>
          </td>
          <td class="p-2 whitespace-nowrap font-medium">
            {{ client?.fullname }}
          </td>
          <td class="p-2">
            {{ client.email }}
          </td>
          <td class="p-2">
            {{ client.phoneNumber }}
          </td>
          <td class="p-2">
            {{ client.address }}
          </td>
          <td class="p-2 whitespace-nowrap">
            {{ n(client.credit!, "decimal") }} DH
          </td>
          <td class="p-2">
            <div class="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <GripHorizontal class="text-slate-800 inline" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    @click="toggleThisClient(client, 'ClientDelete')"
                  >
                    <Trash2 :size="20" class="text-red-500 inline mr-2" />
                    <span class="text-red-500">
                      {{ t("g.actions.delete") }}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    @click="toggleThisClient(client, 'ClientUpdate')"
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
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination />
  </div>
</template>
