import { BaseDirectory, createDir, copyFile, exists } from "@tauri-apps/api/fs";
// import { sendNotification } from "@tauri-apps/api/notification";
import { pictureDir, downloadDir, appDataDir, sep } from "@tauri-apps/api/path";
import { defineComponent, ref, type PropType } from "vue";
import { UiUploaderHtml } from "./UiUploaderHtml";
import { open } from "@tauri-apps/api/dialog";
import { ImagesFiles } from "@/constants/FileTypes";
import type { FileNames } from "@/constants/FileType";

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
      type: String as PropType<FileNames>,
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
      const RightFolder = name === "Image" ? "Images" : "Docs";
      try {
        await createFolder(RightFolder);
        const fileName = path.split(sep)[path.split(sep).length - 1];
        const fileExtention = fileName.split(".")[1];
        await copyFile(
          path,
          (await appDataDir())
            .concat(sep)
            .concat(RightFolder)
            .concat(sep)
            .concat(fileName),
          {
            dir: BaseDirectory.AppData,
          }
        );
        onSave(fileName);
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

    return () => (
      <UiUploaderHtml
        selectedFile={selectedFile.value ?? ""}
        openDialog={() => OpenDialog()}
        FileType={name}
      />
    );
  },
});
