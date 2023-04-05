import { pictureDir, downloadDir } from "@tauri-apps/api/path";
import { defineComponent, ref, type PropType } from "vue";
import type { FileNames } from "@/types";
import { open } from "@tauri-apps/api/dialog";
import UiIcon from "./UiIcon.vue";

export const UiUploader = defineComponent({
  name: "UiUploader",
  components: { UiIcon },
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

    const getpath = (src: string) => new URL(src, import.meta.url).toString();

    return () => (
      <div class="w-36 relative h-36 rounded-md overflow-hidden flex text-black justify-center items-center">
        {name === "Image" ?? (
          <img
            class="absolute top-0 rounded-md object-cover w-full h-full"
            src={getpath("../../assets/images/clients.jpg")}
          />
        )}
        <div class="w-full bg-white/40 transition-all duration-200 group hover:bg-white/30 absolute top-0 z-10 h-full">
          <button
            onClick={() => OpenDialog()}
            class="w-full text-gray-500 transition-all duration-200 hover:scale-125  h-full grid hover:text-black  justify-center items-center"
          >
            <UiIcon
              Class=" "
              name={name === "Image" ? "addPicture" : "AddDoc"}
            />
          </button>
        </div>
      </div>
    );
  },
});
