<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { globalTranslate } from "@/utils/globalTranslate";
import { SELLER_CREATE } from "@/constants/defaultValues";
import { ImagesFiles } from "@/constants/FileTypes";
import UiUploader from "./ui/UiUploader.vue";
import type { newSellerT } from "@/types";
import { invoke } from "@tauri-apps/api";
import { saveFile } from "@/utils/fs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { store } from "@/store";
import { ref } from "vue";

const { updateQueryParams } = useUpdateRouteQueryParams();
const isLoading = ref<boolean>(false);

const seller = ref<newSellerT>(Object.assign({}, SELLER_CREATE));

const createNewSeller = async () => {
  isLoading.value = true;
  if (seller.value.name !== "") {
    try {
      let image: string = await saveFile(seller.value.image as string, "Image");
      await invoke("insert_seller", { seller: { ...seller.value, image } });
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

const saveImage = (image: string) => {
  seller.value.image = image;
};
</script>

<template>
  <div
    class="w-1/2 h-fit rounded-[4px] z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]"
  >
    <h1
      class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center"
    >
      {{ globalTranslate("Sellers.create.title") }}
    </h1>
    <div class="h-full w-full flex flex-col gap-2">
      <div class="w-full h-fit flex justify-center">
        <UiUploader
          name="Image"
          :extensions="ImagesFiles"
          @on:save="saveImage"
        />
      </div>
      <Input
        v-model="seller.name"
        type="text"
        :placeHolder="globalTranslate('Sellers.create.placeholders[0]')"
      />
      <Input
        v-model="seller.email"
        type="text"
        :placeHolder="globalTranslate('Sellers.create.placeholders[1]')"
      />
      <Input
        v-model="seller.phone"
        type="text"
        :placeHolder="globalTranslate('Sellers.create.placeholders[2]')"
      />
      <Input
        v-model="seller.address"
        type="text"
        :placeHolder="globalTranslate('Sellers.create.placeholders[3]')"
      />
    </div>
    <div class="flex">
      <Button :disabled="isLoading" class="w-full" @click="createNewSeller">
        {{ globalTranslate("Sellers.create.button") }}
      </Button>
    </div>
  </div>
</template>
