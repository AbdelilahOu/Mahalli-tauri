<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import UiPagination from "./ui/UiPagination.vue";
import { RouterLink } from "vue-router";
import { FilePenLine, BookUser, Trash2 } from "lucide-vue-next";
import { store } from "@/store";
import type { ClientT } from "@/schemas/client.schema";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { Skeleton } from "./ui/skeleton";
import { SheetTrigger } from "@/components/ui/sheet";

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
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <table class="w-full">
      <thead
        class="text-xs h-9 bg-gray-300 max-w-lg w-fit font-semibold uppercase text-[rgba(25,23,17,0.6)]"
      >
        <tr>
          <th class="p-2 rounded-l-md"></th>
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
          <th class="p-2 w-fit font-semibold text-left">
            {{ t("g.fields.credit") }}
          </th>
          <th class="rounded-r-md">
            {{ t("g.fields.actions") }}
          </th>
        </tr>
      </thead>
      <tbody class="text-sm divide-y divide-gray-100">
        <tr v-for="(client, index) in clients" v-fade="index" :key="client.id">
          <td class="p-2">
            <div class="w-12 h-12 rounded-full overflow-hidden">
              <Skeleton
                class="rounded-full w-full h-full block object-fill animate-pulse bg-slate-300 duration-1000"
              >
                <img
                  v-if="client.image"
                  class="rounded-full w-full h-full object-cover"
                  :src="convertFileSrc(client.image)"
                />
              </Skeleton>
            </div>
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
            <div class="flex justify-center gap-3">
              <Trash2
                @click="toggleThisClient(client, 'ClientDelete')"
                class="cursor-pointer"
                :size="22"
              />
              <FilePenLine
                @click="toggleThisClient(client, 'ClientUpdate')"
                class="cursor-pointer"
                :size="22"
              />
              <!-- <RouterLink
                :to="{
                  path: '/clients/' + client.id,
                }"
              > -->
              <SheetTrigger @click="(e) => console.log(e)">
                <BookUser :size="22" />
              </SheetTrigger>

              <!-- </RouterLink> -->
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
