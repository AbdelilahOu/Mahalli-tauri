<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import UiPagination from "./ui/UiPagination.vue";
import { Checkbox } from "./ui/checkbox";
import { RouterLink } from "vue-router";
import type { clientT } from "@/types";
import UiIcon from "./ui/UiIcon.vue";
import { store } from "@/store";
import { ref } from "vue";

defineProps<{
  clients: clientT[];
}>();

const { t } = useI18n();
const checkedClients = ref<string[]>([]);

const checkThisUser = (IsInclude: boolean, id: string) => {
  IsInclude
    ? checkedClients.value.push(id)
    : checkedClients.value.splice(checkedClients.value.indexOf(id), 1);
};

const toggleThisClient = (client: clientT, name: string) => {
  store.setters.updateStore({ key: "row", value: client });
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
          <th class="rounded-l-[4px]"></th>
          <th class="p-2"></th>

          <th
            v-for="index in [0, 1, 2, 3, 4]"
            class="p-2 w-fit last:rounded-r-[4px]"
          >
            <div class="font-semibold text-left">
              {{ t(`Clients.index.feilds[${index}]`) }}
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="text-sm divide-y divide-gray-100">
        <tr v-for="(client, index) in clients" v-fade="index" :key="client.id">
          <td class="p-2">
            <span class="h-full w-full grid">
              <Checkbox />
            </span>
          </td>
          <td class="p-2">
            <div class="w-12 h-12 rounded-full overflow-hidden">
              <img
                v-if="client.image"
                class="rounded-full w-full h-full object-cover"
                :src="convertFileSrc(client.image)"
              />
              <span
                v-else
                class="rounded-full w-full h-full object-fill animate-pulse bg-slate-300 duration-150"
              ></span>
            </div>
          </td>
          <td class="p-2">
            <div class="font-medium text-gray-800">
              {{ client?.fullname }}
            </div>
          </td>
          <td class="p-2">
            <div class="text-left whitespace-nowrap overflow-ellipsis">
              {{ client.email }}
              <span v-if="!client.email" class="text-red-400">No email</span>
            </div>
          </td>
          <td class="p-2">
            <div class="text-left whitespace-nowrap overflow-ellipsis">
              {{ client.phone }}
              <span v-if="!client.phone" class="text-red-400">No phone</span>
            </div>
          </td>
          <td class="p-2">
            <div class="text-left whitespace-nowrap overflow-ellipsis">
              {{ client.address }}
              <span v-if="!client.address" class="text-red-400"
                >No address</span
              >
            </div>
          </td>
          <td class="p-2">
            <div class="flex justify-start gap-3">
              <span @click="toggleThisClient(client, 'ClientDelete')">
                <UiIcon isStyled name="delete" />
              </span>
              <span @click="toggleThisClient(client, 'ClientUpdate')">
                <UiIcon isStyled name="edit" />
              </span>
              <RouterLink
                :to="{
                  name: 'ClientDetails',
                  params: { id: client.id },
                }"
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
