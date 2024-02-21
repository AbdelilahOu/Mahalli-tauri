<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { ImagesFiles } from "@/constants/FileTypes";
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

const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();

const clientSchema = toTypedSchema(CreateClientSchema);

const form = useForm({
  validationSchema: clientSchema,
});

const image = ref<string>();

const isLoading = ref<boolean>(false);

const createNewClient = async (client: ClientT) => {
  isLoading.value = true;
  try {
    let image: string = await saveFile(client.image as string, "Image");
    await invoke("create_client", {
      client: {
        full_name: client.fullname,
        email: client.email,
        phone_number: client.phoneNumber,
        address: client.address,
        image,
      },
    });
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
          :extensions="ImagesFiles"
          @on:save="setImage"
        />
        <FormField v-slot="{ componentField }" name="fullname">
          <FormItem>
            <FormLabel>{{ t("c.p.a") }}</FormLabel>
            <FormControl>
              <Input
                type="text"
                :placeHolder="t('c.p.a')"
                v-bind="componentField"
              />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>{{ t("c.p.b") }}</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeHolder="example@gmail.com"
                v-bind="componentField"
              />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="phoneNumber">
          <FormItem>
            <FormLabel>{{ t("c.p.c") }}</FormLabel>
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
            <FormLabel>{{ t("c.p.d") }}</FormLabel>
            <FormControl>
              <Input
                type="text"
                :placeHolder="t('c.p.d')"
                v-bind="componentField"
              />
            </FormControl>
          </FormItem>
        </FormField>
        <div class="w-full grid grid-cols-3 gap-2">
          <Button :disabled="isLoading" type="submit" class="w-full col-span-2">
            {{ t("g.b.c") }}
          </Button>
          <Button
            @click="hideModal"
            type="button"
            :disabled="isLoading"
            variant="outline"
          >
            {{ t("g.b.no") }}</Button
          >
        </div>
      </form>
    </template>
  </UiModalCard>
</template>
