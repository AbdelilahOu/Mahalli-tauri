import { defineComponent, ref, type PropType } from "vue";
import { ask, confirm, open, save, message } from "@tauri-apps/api/dialog";
import { downloadDir } from "@tauri-apps/api/path";

import imagess from "../../assets/images/clients.jpg";
export const UiUploader = defineComponent({
  name: "UiUploader",
  props: {
    onSave: {
      type: Function as PropType<(path: string) => void>,
      required: true,
    },
  },
  setup({ onSave }) {
    const selectedFile = ref();
    const OpenDialog = async () => {
      selectedFile.value = await save({
        filters: [
          {
            name: "Image",
            extensions: ["png", "jpeg"],
          },
        ],
        defaultPath: await downloadDir(),
      });
      onSave(selectedFile.value);
    };
    return () => (
      <div class="w-36 relative h-36 rounded-md overflow-hidden flex text-black justify-center items-center">
        <img
          class="absolute top-0 rounded-md object-cover w-full h-full"
          src={imagess}
        />
        <div class="w-full bg-white/40 transition-all duration-200 group hover:bg-white/30 absolute top-0 z-10 h-full">
          {selectedFile.value}
          <button
            onClick={() => OpenDialog()}
            class="w-full text-gray-500  h-full grid justify-center items-center"
          >
            <svg
              class="group-hover:scale-125 transition-all duration-200 group-hover:text-black"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h8q.425 0 .713.288T14 4q0 .425-.288.713T13 5H5v14h14v-8q0-.425.288-.713T20 10q.425 0 .713.288T21 11v8q0 .825-.588 1.413T19 21H5ZM18 9q-.425 0-.713-.288T17 8V7h-1q-.425 0-.713-.288T15 6q0-.425.288-.713T16 5h1V4q0-.425.288-.713T18 3q.425 0 .713.288T19 4v1h1q.425 0 .713.288T21 6q0 .425-.288.713T20 7h-1v1q0 .425-.288.713T18 9ZM7 17h10q.3 0 .45-.275t-.05-.525l-2.75-3.675q-.15-.2-.4-.2t-.4.2L11.25 16L9.4 13.525q-.15-.2-.4-.2t-.4.2l-2 2.675q-.2.25-.05.525T7 17Zm-2-6v8V5v6Z"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  },
});
