<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useI18n } from "vue-i18n";
import { toTypedSchema } from "@vee-validate/zod";
import UiModalCard from "./ui/UiModalCard.vue";
import UiUploader from "./ui/UiUploader.vue";
import { invoke } from "@tauri-apps/api";
import { useForm } from "vee-validate";
import { saveFile } from "@/utils/fs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { store } from "@/store";
import { ref } from "vue";
import {
  CreateSupplierSchema,
  type SupplierT,
} from "@/schemas/supplier.schema";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { t } = useI18n();
const isLoading = ref<boolean>(false);

const supplierSchema = toTypedSchema(CreateSupplierSchema);

const imagePath = ref<string>();

const form = useForm({
  validationSchema: supplierSchema,
});

const createNewSupplier = async (supplier: SupplierT) => {
  isLoading.value = true;
  try {
    let image: string = await saveFile(supplier.image as string, "Image");
    await invoke("create_supplier", {
      supplier: {
        full_name: supplier.fullname,
        email: supplier.email,
        phone_number: supplier.phoneNumber,
        address: supplier.address,
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
  createNewSupplier(values);
});

const saveImage = (image: string) => {
  imagePath.value = image;
};
</script>

<template>
  <UiModalCard>
    <template #title>
      {{ t("s.c.title") }}
    </template>
    <template #content>
      <form class="h-full w-full flex flex-col gap-2" @submit="onSubmit">
        <UiUploader
          name="Image"
          :extensions="['png', 'jpeg', 'webp']"
          @on:save="saveImage"
        />
        <FormField v-slot="{ componentField }" name="fullname">
          <FormItem>
            <FormLabel>{{ t("s.p.a") }}</FormLabel>
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
            <FormLabel>{{ t("s.p.b") }}</FormLabel>
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
            <FormLabel>{{ t("s.p.c") }}</FormLabel>
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
            <FormLabel>{{ t("s.p.d") }}</FormLabel>
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
            {{ t("g.b.c") }}
          </Button>
          <Button
            @click="hideModal"
            type="button"
            :disabled="isLoading"
            variant="outline"
          >
            {{ t("g.b.no") }}
          </Button>
        </div>
      </form>
    </template>
  </UiModalCard>
</template>
