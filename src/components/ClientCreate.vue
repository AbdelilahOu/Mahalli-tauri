<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { toTypedSchema } from "@vee-validate/zod";
import UiModalCard from "./ui/UiModalCard.vue";
import UiUploader from "./ui/UiUploader.vue";
import { invoke } from "@tauri-apps/api";
import { useForm } from "vee-validate";
import { saveFile } from "@/utils/fs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useI18n } from "vue-i18n";
import { store } from "@/store";
import { ref } from "vue";
import { CreateClientSchema, type ClientT } from "@/schemas/client.schema";
import { info, error } from "tauri-plugin-log-api";
import type { Res } from "@/types";

const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();

const clientSchema = toTypedSchema(CreateClientSchema);

const form = useForm({
  validationSchema: clientSchema,
});

const image = ref<string>();

const isCreating = ref<boolean>(false);

const createNewClient = async (client: ClientT) => {
  isCreating.value = true;
  try {
    let image: string = await saveFile(client.image as string, "Image");
    let res = await invoke<Res<null>>("create_client", {
      client: {
        full_name: client.fullname,
        email: client.email,
        phone_number: client.phoneNumber,
        address: client.address,
        image,
      },
    });
    if (res.error) {
      throw new Error(res.error);
    }
    //
    info(
      `CREATE CLIENT: { full_name: ${client.fullname}, email: ${client.email}, phone_number: ${client.phoneNumber}, address: ${client.address} }`,
    );
    // toggle refresh
    updateQueryParams({
      refresh: "refresh-create-" + Math.random() * 9999,
    });
  } catch (err) {
    error("ERROR: error creating client : " + err);
  } finally {
    isCreating.value = false;
    hideModal();
  }
};

const hideModal = () => {
  store.setters.updateStore({ key: "show", value: false });
};

const onSubmit = form.handleSubmit((values) => {
  createNewClient(values);
});

const setImage = (imagePath: string) => {
  image.value = imagePath;
};
</script>

<template>
  <UiModalCard>
    <template #title>
      {{ t("c.c.title") }}
    </template>
    <template #content>
      <form class="h-full w-full flex flex-col gap-2" @submit="onSubmit">
        <UiUploader
          name="Image"
          :extensions="['png', 'jpeg', 'webp']"
          @on:save="setImage"
        />
        <FormField v-slot="{ componentField }" name="fullname">
          <FormItem>
            <FormLabel>{{ t("g.fields.fullname") }}</FormLabel>
            <FormControl>
              <Input
                :placeholder="t('g.fields.fullname')"
                v-bind="componentField"
              />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>{{ t("g.fields.email") }}</FormLabel>
            <FormControl>
              <Input placeholder="example@gmail.com" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="phoneNumber">
          <FormItem>
            <FormLabel>{{ t("g.fields.phone") }}</FormLabel>
            <FormControl>
              <Input placeholder="+2126********" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="address">
          <FormItem>
            <FormLabel>{{ t("g.fields.address") }}</FormLabel>
            <FormControl>
              <Input
                :placeholder="t('g.fields.address')"
                v-bind="componentField"
              />
            </FormControl>
          </FormItem>
        </FormField>
        <div class="w-full grid grid-cols-3 gap-2">
          <Button
            :disabled="isCreating"
            type="submit"
            class="w-full col-span-2"
          >
            {{ t("g.b.c") }}
          </Button>
          <Button
            @click="hideModal"
            type="button"
            :disabled="isCreating"
            variant="outline"
          >
            {{ t("g.b.no") }}</Button
          >
        </div>
      </form>
    </template>
  </UiModalCard>
</template>
