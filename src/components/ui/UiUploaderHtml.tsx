import type { FileNames } from "@/constants/FileType";
import { defineComponent, type PropType } from "vue";
import UiIcon from "./UiIcon.vue";

export const UiUploaderHtml = defineComponent({
  name: "UiUploaderHtml",
  props: {
    FileType: {
      type: String as PropType<FileNames>,
      required: true,
    },
    openDialog: {
      type: Function as PropType<() => void>,
      required: true,
    },
    selectedFile: {
      type: String,
    },
  },
  components: { UiIcon },
  setup({ FileType, openDialog, selectedFile }) {
    const getpath = (src: string) => new URL(src, import.meta.url).toString();
    return () => (
      <div class="w-36 relative h-36 rounded-md overflow-hidden flex text-black justify-center items-center">
        {FileType === "Image" ?? (
          <img
            class="absolute top-0 rounded-md object-cover w-full h-full"
            src={getpath("../../assets/images/clients.jpg")}
          />
        )}
        <div class="w-full bg-white/40 transition-all duration-200 group hover:bg-white/30 absolute top-0 z-10 h-full">
          <button
            onClick={() => openDialog()}
            class="w-full text-gray-500 transition-all duration-200 hover:scale-125  h-full grid hover:text-black  justify-center items-center"
          >
            <UiIcon
              Class=" "
              name={FileType === "Image" ? "addPicture" : "AddDoc"}
            />
          </button>
        </div>
      </div>
    );
  },
});
