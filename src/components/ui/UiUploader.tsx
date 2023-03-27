import { pictureDir, downloadDir, appDataDir, sep } from "@tauri-apps/api/path";
import { BaseDirectory, createDir, copyFile } from "@tauri-apps/api/fs";
import { exists, renameFile, writeBinaryFile } from "@tauri-apps/api/fs";
import { sendNotification } from "@tauri-apps/api/notification";
import { defineComponent, ref, type PropType } from "vue";
import { ImagesFiles } from "@/constants/FileTypes";
import { UiUploaderHtml } from "./UiUploaderHtml";
import { open } from "@tauri-apps/api/dialog";

export const UiUploader = defineComponent({
  name: "UiUploader",
  components: { UiUploaderHtml },
  props: {
    onSave: {
      type: Function as PropType<(path: string) => void>,
      required: true,
    },
    extensions: {
      type: Array as PropType<string[]>,
      default: ImagesFiles,
    },
    name: {
      type: String as PropType<"Image" | "Pdf" | "Word">,
      default: "Image",
    },
  },
  setup({ onSave, extensions, name }) {
    const selectedFile = ref<string | null>();
    const OpenDialog = async () => {
      try {
        selectedFile.value = (await open({
          multiple: false,
          filters: [{ name, extensions }],
          defaultPath:
            name == "Image" ? await pictureDir() : await downloadDir(),
          // C:\Users\abdel\AppData\Roaming\tauriApp
        })) as string | null;

        if (selectedFile.value) {
          saveFile(selectedFile.value);
          return;
        }
      } catch (error) {
        console.log("sth went wrong reading the file");
      }
    };

    const saveFile = async (path: string) => {
      try {
        if (name === "Image") {
          await createFolder("Images");
          await writeBinaryFile(path, new Uint32Array([]), {
            dir: BaseDirectory.AppData,
          });
          await copyFile(
            path,
            "Image"
              .concat(sep)
              .concat(selectedFile.value?.split("/")[-1] as string),
            {
              dir: BaseDirectory.AppData,
            }
          );
          onSave(path);
          return;
        }
        await createFolder("Docs");
        onSave(path);
      } catch (error) {
        console.log("sth went wrong", error);
      }
    };

    const createFolder = async (folder: string) => {
      if (!(await checkIfExistsInFs(folder))) {
        try {
          await createDir(folder, {
            dir: BaseDirectory.AppData,
            recursive: true,
          });
          return true;
        } catch (error) {
          return false;
        }
      }
      return true;
    };

    const checkIfExistsInFs = async (fileOrFolder: string) => {
      try {
        return await exists(fileOrFolder, {
          dir: BaseDirectory.AppData,
        });
      } catch (error) {
        console.log("err in exists");
      }
    };

    const rename = async (old: string, fileName: string) => {
      try {
        const dataPath = (await appDataDir()).concat(sep);
        await renameFile(dataPath.concat(old), dataPath.concat(fileName), {
          dir: BaseDirectory.AppData,
        });
      } catch (error) {
        console.log("err in rename");
      }
    };

    return () => (
      <UiUploaderHtml
        selectedFile={selectedFile.value ?? ""}
        openDialog={() => OpenDialog()}
        FileType={name}
      />
    );
  },
});
