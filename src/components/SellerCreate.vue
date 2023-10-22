<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useI18n } from "vue-i18n";
import { ImagesFiles } from "@/constants/FileTypes";
import { toTypedSchema } from "@vee-validate/zod";
import UiModalCard from "./ui/UiModalCard.vue";
import UiUploader from "./ui/UiUploader.vue";
import type { newSellerT } from "@/types";
import { invoke } from "@tauri-apps/api";
import { useForm } from "vee-validate";
import { saveFile } from "@/utils/fs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { store } from "@/store";
import { ref } from "vue";
import { z } from "zod";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { t } = useI18n();
const isLoading = ref<boolean>(false);

const sellerSchema = toTypedSchema(
  z.object({
    name: z.string().min(2).max(50),
    email: z.string().min(2).max(50),
    phone: z.string().min(2).max(50),
    address: z.string().min(2).max(50),
  })
);

const imagePath = ref<string>();

const form = useForm({
  validationSchema: sellerSchema,
});

const createNewSeller = async (seller: newSellerT) => {
  isLoading.value = true;
  if (seller.name !== "") {
    try {
      let image: string = await saveFile(seller.image as string, "Image");
      await invoke("insert_seller", { seller: { ...seller, image } });
      // toggle refresh
      updateQueryParams({
        refresh: "refresh-create-" + Math.random() * 9999,
      });
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
      store.setters.updateStore({ key: "show", value: false });
    }
    return;
  }
  isLoading.value = false;
};

const hideModal = () => {
  store.setters.updateStore({ key: "show", value: false });
};

const onSubmit = form.handleSubmit((values) => {
  createNewSeller(values);
});

const saveImage = (image: string) => {
  imagePath.value = image;
};
</script>

<template>
  <UiModalCard>
    <template #title>
      {{ t("Sellers.create.title") }}
    </template>
    <template #content>
      <form class="h-full w-full flex flex-col gap-2" @submit="onSubmit">
        <UiUploader
          name="Image"
          :extensions="ImagesFiles"
          @on:save="saveImage"
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
            {{ t("Sellers.create.button") }}
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
