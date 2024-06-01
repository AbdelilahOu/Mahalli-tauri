<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import type { ClientT } from "@/schemas/client.schema";
import { store } from "@/store";
import { FilePenLine, Trash2, GripHorizontal } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import UiPagination from "./ui/UiPagination.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

defineProps<{
  clients: ClientT[];
}>();

const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();

const toggleThisClient = (client: ClientT, name: string) => {
  updateQueryParams({
    id: client.id,
    fullname: client.fullname,
    email: client.email,
    phoneNumber: client.phoneNumber,
    address: client.address,
  });
  store.setters.updateStore({ key: "name", value: name });
  store.setters.updateStore({ key: "show", value: true });
};

const toggleCLientProfile = (client: ClientT) => {
  updateQueryParams({
    id: client.id,
    fullname: client.fullname,
    email: client.email,
    phoneNumber: client.phoneNumber,
    address: client.address,
    // image: client.image,
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
          <th>{{ t("g.fields.credit") }}</th>
          <th class="small">{{ t("g.fields.actions") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(client, index) in clients" v-fade="index" :key="client.id">
          <td class="p-2 flex justify-center">
            <Avatar>
              <AvatarImage :src="client.image ?? ''" />
              <AvatarFallback class="text-xs">
                {{ client.fullname.substring(0, 5) }}
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
          <td class="p-2 whitespace-nowrap">{{ client.credi }} DH</td>
          <td class="p-2">
            <div class="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <GripHorizontal class="text-slate-800 inline" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <!-- <DropdownMenuLabel>My Account</DropdownMenuLabel> -->
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
              <!-- <SheetTrigger @click="(e) => toggleCLientProfile(client)">
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
