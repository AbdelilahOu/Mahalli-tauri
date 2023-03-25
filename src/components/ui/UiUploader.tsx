import { defineComponent, ref, type PropType } from "vue";
import { open, save } from "@tauri-apps/api/dialog";
import { pictureDir, downloadDir } from "@tauri-apps/api/path";
import {
  BaseDirectory,
  writeBinaryFile,
  createDir,
  exists,
} from "@tauri-apps/api/fs";
import {
  sendNotification,
  isPermissionGranted,
} from "@tauri-apps/api/notification";
import { UiUploaderHtml } from "./UiUploaderHtml";

export const UiUploader = defineComponent({
  name: "UiUploader",
  props: {
    onSave: {
      type: Function as PropType<(path: string) => void>,
      required: true,
    },
    extensions: {
      type: Array as PropType<string[]>,
      default: ["png", "jpeg", "webp"],
    },
    name: {
      type: String,
      default: "Image",
    },
  },
  setup({ onSave, extensions, name }) {
    const selectedFile = ref<string | null>();
    const OpenDialog = async () => {
      selectedFile.value = await save({
        filters: [{ name, extensions }],
        defaultPath: name == "Image" ? await pictureDir() : await downloadDir(),
      });
      if (selectedFile.value) {
        saveFile(selectedFile.value);
        return;
      }
      console.log("sth went wrong reading the file");
    };
    const saveFile = async (path: string) => {
      onSave(path);
    };

    const getpath = (src: string) => new URL(src, import.meta.url).toString();

    return () => <UiUploaderHtml openDialog={() => OpenDialog()} />;
  },
});
