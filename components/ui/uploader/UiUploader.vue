<script setup lang="ts">
import { open } from "@tauri-apps/api/dialog";
import { downloadDir, pictureDir, sep } from "@tauri-apps/api/path";
import { useDropZone } from "@vueuse/core";
import { FileCheck, Trash2, Upload } from "lucide-vue-next";
import { error } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const { name, extensions } = defineProps<{
  extensions: string[];
  name: string;
}>();

const emits = defineEmits<{
  saveBase64: [payload: string];
  saveBytes: [payload: Uint8Array, name: string];
}>();

const { t } = useI18n();
const dropZone = ref<HTMLDivElement>();
const isFileSelected = ref(false);
const selectedFile = ref<string | null>();

async function onDrop(files: File[] | null) {
  if (files) {
    const file = files[0];
    const fileBytes = await getBytesArray(file);
    emits("saveBytes", fileBytes, file.name);
    if (name === "Image") {
      const base64 = btoa(String.fromCharCode(...fileBytes));
      emits("saveBase64", base64);
      selectedFile.value = base64;
    } else {
      isFileSelected.value = true;
    }
  }
}

const { isOverDropZone } = useDropZone(dropZone, onDrop);

async function OpenDialog() {
  try {
    const filePath = (await open({
      multiple: false,
      filters: [{ name, extensions }],
      defaultPath: name === "Image" ? await pictureDir() : await downloadDir(),
    })) as string | null;

    if (filePath) {
      const fileBytes = await getFileBytes(filePath);
      if (fileBytes) {
        emits("saveBytes", fileBytes, filePath.split(sep).at(-1)!);
        if (name === "Image") {
          const base64 = btoa(String.fromCharCode(...fileBytes));
          emits("saveBase64", base64);
          selectedFile.value = base64;
        } else {
          isFileSelected.value = true;
        }
      }
    }
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    error(`ERROR PDF-LIB: ${err}`);
  }
}
</script>

<template>
  <div
    class="w-full relative h-36 flex-col rounded-md flex text-black justify-center items-center"
  >
    <span
      v-if="selectedFile"
      class="absolute w-8 h-8 bg-white rounded-bl-md rounded-tr-md hover:bg-gray-100 cursor-pointer transition-all duration-150 -top-0 flex items-center justify-center -right-0 z-[90]"
      @click="selectedFile = null"
    >
      <Trash2 :size="20" />
    </span>
    <img
      v-if="name === 'Image' && selectedFile"
      class="absolute top-0 border border-gray-300 rounded-md object-cover w-full h-full"
      :src="`data:image/png;base64,${selectedFile}`"
    />
    <div
      v-else
      ref="dropZone"
      class="w-full relative h-full rounded-md transition-all duration-200 transform z-50 border-2 border-dashed border-spacing-4 flex items-center justify-center"
      :class="[
        isOverDropZone
          ? 'fill-sky-500 border-sky-500 bg-sky-200'
          : isFileSelected
          ? 'fill-green-400 border-green-300 bg-green-200'
          : 'fill-gray-400 border-gray-300 bg-white',
      ]"
    >
      <button
        type="button"
        class="w-full h-full flex flex-col gap-2 justify-center items-center"
        :class="[isOverDropZone ? 'text-sky-500' : 'text-gray-400']"
        @mouseenter="isOverDropZone = true"
        @mouseleave="isOverDropZone = false"
        @click="OpenDialog"
      >
        <span v-if="!isFileSelected">
          {{ t("dropZone") }}
        </span>
        <Upload v-if="!isFileSelected" :size="26" />
        <FileCheck
          v-if="isFileSelected && name === 'Pdf'"
          class="fill-green-200 stroke-green-800"
          :size="30"
        />
      </button>
    </div>
  </div>
</template>
