<script setup lang="ts">
import { defineComponent, reactive, onBeforeUnmount, computed } from "vue";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { CLIENT_UPDATE } from "@/constants/defaultValues";
import { globalTranslate } from "@/utils/globalTranslate";
import type { clientT, updateClientT } from "@/types";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { invoke } from "@tauri-apps/api";
import { store } from "@/store";

const ClientRow = computed(() => store.getters.getSelectedRow<clientT>());
const { updateQueryParams } = useUpdateRouteQueryParams();

const updateClient = reactive<updateClientT>(
  ClientRow.value ? ClientRow.value : CLIENT_UPDATE
);

const updateTheClient = async () => {
  if (updateClient.id) {
    try {
      await invoke("update_client", {
        client: updateClient,
        id: updateClient.id,
      });
      // toggle refresh
      updateQueryParams({
        refresh: "refresh-update-" + Math.random() * 9999,
      });
    } catch (error) {
      console.log(error);
    } finally {
      store.setters.updateStore({ key: "show", value: false });
    }
  }
};

onBeforeUnmount(() => store.setters.updateStore({ key: "row", value: null }));
</script>

<template>
  <div
    class="w-1/2 h-fit rounded-[4px] z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]"
  >
    <h1
      class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center"
    >
      {{ globalTranslate("Clients.update.title") }}
    </h1>
    <div class="h-full w-full flex flex-col gap-2">
      <Input
        v-model="updateClient.fullname"
        type="text"
        :placeHolder="globalTranslate('Clients.create.placeholders[0]')"
      />
      <Input
        v-model="updateClient.email"
        type="text"
        :placeHolder="globalTranslate('Clients.create.placeholders[1]')"
      />
      <Input
        v-model="updateClient.phone"
        type="text"
        :placeHolder="globalTranslate('Clients.create.placeholders[2]')"
      />
      <Input
        v-model="updateClient.address"
        type="text"
        :placeHolder="globalTranslate('Clients.create.placeholders[3]')"
      />
    </div>
    <div class="flex">
      <Button class="w-full" @click="updateTheClient">
        {{ globalTranslate("Clients.update.button") }} {{ updateClient.name }}
      </Button>
    </div>
  </div>
</template>
