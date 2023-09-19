import { defineComponent } from "vue";
import { UiButton } from "./ui/UiButton";
import { invoke } from "@tauri-apps/api";

export const Sittings = defineComponent({
  setup() {
    const Export = async () => {
      try {
        await invoke("export_db_csv");
      } catch (error) {
        console.log(error);
      } finally {
      }
    };

    return (
      <div class="w-1/2 h-fit z-50 gap-3 rounded-[4px] flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          Sittings
        </h1>
        <div class="h-full w-full flex  flex-col gap-2">
          <div class="w-full h-10 flex">
            <span>Export database as csv</span>
            <UiButton colorTheme="" Click={() => Export()}>
              Export
            </UiButton>
          </div>
        </div>
      </div>
    );
  },
});
