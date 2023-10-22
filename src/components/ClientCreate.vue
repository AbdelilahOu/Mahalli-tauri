<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { useI18n } from "vue-i18n";
import { ImagesFiles } from "@/constants/FileTypes";
import { toTypedSchema } from "@vee-validate/zod";
import UiModalCard from "./ui/UiModalCard.vue";
import UiUploader from "./ui/UiUploader.vue";
import type { newClientT } from "@/types";
import { invoke } from "@tauri-apps/api";
import { useForm } from "vee-validate";
import { saveFile } from "@/utils/fs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ref } from "vue";
import { store } from "@/store";
import { z } from "zod";

const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();

const clientSchema = toTypedSchema(
  z.object({
    fullname: z.string().min(2).max(50),
    email: z.string().min(2).max(50),
    phone: z.string().min(2).max(50),
    address: z.string().min(2).max(50),
  })
);

const form = useForm({
  validationSchema: clientSchema,
});

const image = ref<string>();

const isLoading = ref<boolean>(false);

const createNewClient = async (client: newClientT) => {
  isLoading.value = true;
  if (client.fullname !== "") {
    try {
      let image: string = await saveFile(client.image as string, "Image");
      await invoke("insert_client", { client: { ...client, image } });
      // toggle refresh
      updateQueryParams({
        refresh: "refresh-create-" + Math.random() * 9999,
      });
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
      hideModal();
    }
    return;
  }
  isLoading.value = false;
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
      {{ t("Clients.create.title") }}
    </template>
    <template #content>
      <form class="h-full w-full flex flex-col gap-2" @submit="onSubmit">
        <UiUploader
          name="Image"
          :extensions="ImagesFiles"
          @on:save="setImage"
        />
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
            {{ t("Clients.create.button") }}
          </Button>
          <Button
            @click="hideModal"
            type="button"
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
