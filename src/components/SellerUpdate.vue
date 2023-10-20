<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { globalTranslate } from "@/utils/globalTranslate";
import type { sellerT, updateSellerT } from "@/types";
import { ref, computed, onBeforeUnmount } from "vue";
import { invoke } from "@tauri-apps/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { store } from "@/store";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useForm } from "vee-validate";

import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import UiModalCard from "./ui/UiModalCard.vue";

const { updateQueryParams } = useUpdateRouteQueryParams();

const SellerRow = computed(() => store.getters.getSelectedRow<sellerT>());

const isLoading = ref<boolean>(false);

const sellerSchema = toTypedSchema(
  z.object({
    name: z.string().min(2).max(50).default(SellerRow.value.name),
    email: z.string().default(SellerRow.value.email ?? ""),
    phone: z.string().default(SellerRow.value.phone ?? ""),
    address: z.string().default(SellerRow.value.address ?? ""),
  })
);

const form = useForm({
  validationSchema: sellerSchema,
});

const updateTheSeller = async (seller: updateSellerT) => {
  if (SellerRow.value.id) {
    try {
      await invoke("update_seller", {
        seller: { ...seller, image: SellerRow.value.image },
        id: SellerRow.value.id,
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
  updateTheSeller(values);
});

onBeforeUnmount(() => store.setters.updateStore({ key: "row", value: null }));
</script>

<template>
  <UiModalCard>
    <template #title>
      {{ globalTranslate("Sellers.update.title") }}
    </template>
    <template #content>
      <form class="h-full w-full flex flex-col gap-2" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="name">
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
            {{ globalTranslate("Sellers.update.button") }} {{ SellerRow.name }}
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
