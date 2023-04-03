import { pictureDir, downloadDir } from "@tauri-apps/api/path";
import { defineComponent, ref, type PropType } from "vue";
import type { FileNames } from "@/types";
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
      required: true,
    },
    name: {
      type: String as PropType<FileNames>,
      required: true,
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
          onSave(selectedFile.value);
          return;
        }
      } catch (error) {
        console.log("sth went wrong reading the file");
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
