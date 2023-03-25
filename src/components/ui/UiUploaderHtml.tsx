import { defineComponent, type PropType } from "vue";
import UiIcon from "./UiIcon.vue";

export const UiUploaderHtml = defineComponent({
  name: "UiUploaderHtml",
  props: {
    FileType: {
      type: String as PropType<"Image" | "Pdf" | "Word">,
      default: "Image",
    },
    openDialog: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  components: { UiIcon },
  setup({ FileType, openDialog }) {
    return () => {
      <div class="w-36 relative h-36 rounded-md overflow-hidden flex text-black justify-center items-center">
        {/* <img
            class="absolute top-0 rounded-md object-cover w-full h-full"
            src={
              selectedFile.value ?? getpath("../../assets/images/clients.jpg")
            }
          /> */}
        <div class="w-full bg-white/40 transition-all duration-200 group hover:bg-white/30 absolute top-0 z-10 h-full">
          <button
            onClick={() => openDialog()}
            class="w-full text-gray-500  h-full grid justify-center items-center"
          >
            <UiIcon name="addPicture" />
          </button>
        </div>
      </div>;
    };
  },
});
