<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { uploadCSVfiles } from "@/utils/fs";
import { defineComponent, ref } from "vue";
import { useDropZone } from "@vueuse/core";
import { invoke } from "@tauri-apps/api";
import UiIconVue from "./ui/UiIcon.vue";
import { Button } from "./ui/button";
import { useRoute } from "vue-router";
import { store } from "@/store";

const route = useRoute();
const { updateQueryParams } = useUpdateRouteQueryParams();

const dropZone = ref<HTMLDivElement>();

const filesData = ref<File[]>([]);

async function onDrop(files: File[] | null) {
  filesData.value = [];
  if (files) {
    filesData.value = files.filter((file) => file.type === "text/csv");
  }
}
const { isOverDropZone } = useDropZone(dropZone, onDrop);

const upload = async () => {
  try {
    await invoke("upload_csv_to_db", {
      csvPath: await uploadCSVfiles({ file: filesData.value[0] }),
      table: route.query.table,
    });
  } catch (error) {
    console.log(error);
  } finally {
    updateQueryParams({
      refresh: "refresh-upload-" + Math.random() * 9999,
    });
    store.setters.updateStore({ key: "show", value: false });
  }
};
</script>

<template>
  <div
    class="w-1/2 h-fit z-50 gap-3 rounded-[4px] flex flex-col bg-white p-2 min-w-[350px]"
  >
    <h1
      class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center"
    >
      Upload csv files
    </h1>
    <div class="h-full w-full flex flex-col gap-2">
      <div
        ref="dropZone"
        :class="[
          'w-full relative rounded-[4px] transition-all duration-200 transform z-50 h-28 border-2 border-dashed border-spacing-4 flex items-center justify-center',

          isOverDropZone
            ? 'fill-sky-500 border-sky-500 bg-sky-200'
            : 'fill-gray-400 border-gray-300 bg-white',
        ]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 256 256"
        >
          <path
            d="m217.5 170.3l-20 48a5.9 5.9 0 0 1-11 0l-20-48a6 6 0 0 1 11-4.6l14.5 34.7l14.5-34.7a6 6 0 1 1 11 4.6ZM76 206.1a15.1 15.1 0 0 1-10 3.9c-8.8 0-16-8.1-16-18s7.2-18 16-18a15.1 15.1 0 0 1 10 3.9a5.9 5.9 0 0 0 8.5-.4a6 6 0 0 0-.5-8.5a26.9 26.9 0 0 0-18-7c-15.4 0-28 13.5-28 30s12.6 30 28 30a26.9 26.9 0 0 0 18-7a6 6 0 0 0 .5-8.5a5.9 5.9 0 0 0-8.5-.4Zm53.2-20.4c-7.8-2-11.2-3.3-11.2-5.7c0-6.1 5.6-7 9-7a19.7 19.7 0 0 1 11.2 3.6a6 6 0 0 0 7.6-9.2A30 30 0 0 0 127 161c-12.4 0-21 7.8-21 19s11.6 15.1 20.1 17.3S138 201 138 204s0 7-11 7a20 20 0 0 1-11.2-3.6a6 6 0 1 0-7.6 9.2A30 30 0 0 0 127 223c14.4 0 23-7.1 23-19s-12.5-16.1-20.8-18.3ZM202 94h-50a6 6 0 0 1-6-6V38H56a2 2 0 0 0-2 2v88a6 6 0 0 1-12 0V40a14 14 0 0 1 14-14h96a5.6 5.6 0 0 1 4.2 1.8l56 55.9A6 6 0 0 1 214 88v40a6 6 0 0 1-12 0Zm-44-12h35.5L158 46.5Z"
          />
        </svg>
      </div>
    </div>
    <div class="w-full h-fit flex flex-col gap-2">
      <div
        v-for="(f, i) in filesData"
        class="grid grid-cols-[30px_1fr_80px_30px] w-full gap-3 h-10 items-center px-1 rounded-[4px] bg-sky-100 text-black fill-black border-sky-300 border-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 256 256"
        >
          <path
            d="m217.5 170.3l-20 48a5.9 5.9 0 0 1-11 0l-20-48a6 6 0 0 1 11-4.6l14.5 34.7l14.5-34.7a6 6 0 1 1 11 4.6ZM76 206.1a15.1 15.1 0 0 1-10 3.9c-8.8 0-16-8.1-16-18s7.2-18 16-18a15.1 15.1 0 0 1 10 3.9a5.9 5.9 0 0 0 8.5-.4a6 6 0 0 0-.5-8.5a26.9 26.9 0 0 0-18-7c-15.4 0-28 13.5-28 30s12.6 30 28 30a26.9 26.9 0 0 0 18-7a6 6 0 0 0 .5-8.5a5.9 5.9 0 0 0-8.5-.4Zm53.2-20.4c-7.8-2-11.2-3.3-11.2-5.7c0-6.1 5.6-7 9-7a19.7 19.7 0 0 1 11.2 3.6a6 6 0 0 0 7.6-9.2A30 30 0 0 0 127 161c-12.4 0-21 7.8-21 19s11.6 15.1 20.1 17.3S138 201 138 204s0 7-11 7a20 20 0 0 1-11.2-3.6a6 6 0 1 0-7.6 9.2A30 30 0 0 0 127 223c14.4 0 23-7.1 23-19s-12.5-16.1-20.8-18.3ZM202 94h-50a6 6 0 0 1-6-6V38H56a2 2 0 0 0-2 2v88a6 6 0 0 1-12 0V40a14 14 0 0 1 14-14h96a5.6 5.6 0 0 1 4.2 1.8l56 55.9A6 6 0 0 1 214 88v40a6 6 0 0 1-12 0Zm-44-12h35.5L158 46.5Z"
          />
        </svg>
        <span>{f.name}</span>
        <div class="w-full text-end">{{ f.size }} bytes</div>
        <span @click="() => filesData.splice(i, 1)">
          <UiIconVue IsStyled name="delete" />
        </span>
      </div>
      <Button v-if="filesData.length" @click="upload"
        >Upload to {{ route.query.table }}</Button
      >
    </div>
  </div>
</template>