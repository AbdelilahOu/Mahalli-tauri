<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useI18n } from "vue-i18n";
import { onBeforeUnmount, computed, ref } from "vue";
import type { clientT, updateClientT } from "@/types";
import { toTypedSchema } from "@vee-validate/zod";
import UiModalCard from "./ui/UiModalCard.vue";
import { invoke } from "@tauri-apps/api";
import { useForm } from "vee-validate";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { store } from "@/store";
import { z } from "zod";

const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();

const ClientRow = computed(() => store.getters.getSelectedRow<clientT>());

const isLoading = ref<boolean>(false);

const clientSchema = toTypedSchema(
  z.object({
    fullname: z.string().min(2).max(50).default(ClientRow.value.fullname),
    email: z.string().default(ClientRow.value.email ?? ""),
    phone: z.string().default(ClientRow.value.phone ?? ""),
    address: z.string().default(ClientRow.value.address ?? ""),
  })
);

const form = useForm({
  validationSchema: clientSchema,
});

const updateTheClient = async (client: updateClientT) => {
  if (ClientRow.value.id) {
    try {
      await invoke("update_client", {
        client: { ...client, image: ClientRow.value.image },
        id: ClientRow.value.id,
      });
      // toggle refresh
      updateQueryParams({
        refresh: "refresh-update-" + Math.random() * 9999,
      });
    } catch (error) {
      console.log(error);
    } finally {
      hideModal();
    }
  }
};

const hideModal = () => {
  store.setters.updateStore({ key: "show", value: false });
};

const onSubmit = form.handleSubmit((values) => {
  updateTheClient(values);
});

onBeforeUnmount(() => store.setters.updateStore({ key: "row", value: null }));
</script>

<template>
  <UiModalCard>
    <template #title>
      {{ t("c.u.title") }}
    </template>
    <template #content>
      <form class="h-full w-full flex flex-col gap-2" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="fullname">
          <FormItem>
            <FormLabel>Full name</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeHolder="full name"
                v-bind="componentField"
              />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeHolder="example@gmail.com"
                v-bind="componentField"
              />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="phone">
          <FormItem>
            <FormLabel>Phone number</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeHolder="+2126********"
                v-bind="componentField"
              />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="address">
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeHolder="Address"
                v-bind="componentField"
              />
            </FormControl>
          </FormItem>
        </FormField>
        <div class="w-full grid grid-cols-3 gap-2">
          <Button :disabled="isLoading" type="submit" class="w-full col-span-2">
            {{ t("c.u.button") }}
            {{ ClientRow.fullname }}
          </Button>
          <Button
            type="button"
            @click="hideModal"
            :disabled="isLoading"
            variant="outline"
          >
            Cancel</Button
          >
        </div>
      </form>
    </template>
  </UiModalCard>
</template>
