<script setup lang="ts">
import { open } from "@tauri-apps/api/dialog";
import { downloadDir, pictureDir, sep } from "@tauri-apps/api/path";
import { useDropZone } from "@vueuse/core";
import { FileCheck, Upload, X } from "lucide-vue-next";
import * as Logger from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

interface Props {
  extensions: string[];
  name: string;
  maxFileSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxFileSize: 10 * 1024 * 1024,
});

const emits = defineEmits<{
  saveBase64: [payload: string];
  saveBytes: [payload: Uint8Array, name: string];
  clear: [];
}>();

const { t } = useI18n();

const dropZone = ref<HTMLDivElement>();

const isFileSelected = ref(false);
const selectedFile = ref<string | null>();

const fileName = ref("");
const dragCounter = ref(0);

function validateFile(file: File): boolean {
  if (file.size > props.maxFileSize) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.fileTooLarge"),
      closeButton: true,
    });
    return false;
  }

  const fileExt = file.name.split(".").pop()?.toLowerCase();
  if (!fileExt || !props.extensions.includes(fileExt)) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.invalidFileType"),
      closeButton: true,
    });
    return false;
  }

  return true;
}

async function processFile(file: File | null) {
  if (!file)
    return;

  try {
    if (!validateFile(file)) {
      return;
    }
    fileName.value = file.name;
    const fileBytes = await getBytesArray(file);
    emits("saveBytes", fileBytes, file.name);

    if (props.name === "Image") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        if (base64) {
          const base64Data = base64.split(",")[1];
          emits("saveBase64", base64Data);
          selectedFile.value = base64Data;
        }
      };
      reader.readAsDataURL(file);
    }
    else {
      isFileSelected.value = true;
    }
  }
  catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    Logger.error(`ERROR Processing File: ${err}`);
  }
  finally {
  }
}

async function onDrop(files: File[] | null) {
  if (files?.length) {
    await processFile(files[0]);
  }
}

const { isOverDropZone } = useDropZone(dropZone, onDrop);

async function handleOpenDialog() {
  try {
    const filePath = (await open({
      multiple: false,
      filters: [{ name: props.name, extensions: props.extensions }],
      defaultPath:
        props.name === "Image" ? await pictureDir() : await downloadDir(),
    })) as string | null;

    if (filePath) {
      const file = new File(
        [(await getFileBytes(filePath))!],
        filePath.split(sep).at(-1)!,
      );
      await processFile(file);
    }
  }
  catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    Logger.error(`ERROR Opening Dialog: ${err}`);
  }
}

function clearFile() {
  selectedFile.value = null;
  isFileSelected.value = false;
  emits("clear");
}

function onDragEnter(e: DragEvent) {
  e.preventDefault();
  dragCounter.value++;
}

function onDragLeave(e: DragEvent) {
  e.preventDefault();
  dragCounter.value--;
}

function onDragOver(e: DragEvent) {
  e.preventDefault();
}
</script>

<template>
  <div class="relative w-full h-36">
    <button
      v-if="selectedFile || isFileSelected"
      class="absolute -top-2 -right-2 z-[90] size-6 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all duration-150 flex items-center justify-center group"
      @click="clearFile"
    >
      <X
        :size="16"
        class="group-hover:scale-110 transition-transform duration-150"
      />
    </button>

    <img
      v-if="name === 'Image' && selectedFile"
      :src="`data:image/png;base64,${selectedFile}`"
      class="absolute top-0 w-full h-full object-cover rounded-md border border-gray-300 shadow-sm transition-all duration-200"
      alt="Selected image preview"
    >

    <div
      v-else
      ref="dropZone"
      class="w-full h-full rounded-md transition-all duration-200 transform relative border-2 border-dashed border-spacing-4 flex items-center justify-center"
      :class="[
        isOverDropZone || dragCounter > 0
          ? 'border-sky-500 bg-sky-50'
          : isFileSelected
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 bg-white hover:border-sky-400 hover:bg-sky-50',
      ]"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @dragover="onDragOver"
    >
      <button
        type="button"
        class="w-full h-full flex flex-col gap-3 justify-center items-center transition-all duration-200 transform disabled:opacity-50"
        :class="[
          isOverDropZone || dragCounter > 0
            ? 'text-sky-500'
            : isFileSelected
              ? 'text-green-500'
              : 'text-gray-400 hover:text-sky-500',
        ]"
        @click="handleOpenDialog"
      >
        <span v-if="!isFileSelected" class="text-sm font-medium">
          {{ t("dropZone") }}
        </span>
        <Upload
          v-if="!isFileSelected"
          :size="26"
          class="transition-transform duration-200 hover:scale-110"
        />
        <span
          v-if="isFileSelected && name === 'Pdf'"
          class="text-sm font-medium space-y-1"
        >
          <FileCheck
            :size="30"
            class="transition-transform duration-200 hover:scale-110 m-auto"
          />
          <p>{{ fileName }}</p>
        </span>
      </button>
    </div>
  </div>
</template>
