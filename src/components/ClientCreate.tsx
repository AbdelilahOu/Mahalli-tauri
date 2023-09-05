import { globalTranslate } from "@/utils/globalTranslate";
import { defineComponent, reactive, ref } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { ImagesFiles } from "@/constants/FileTypes";
import { UiUploader } from "./ui/UiUploader";
import type { newClientT } from "@/types";
import { UiButton } from "./ui/UiButton";
import { UiInput } from "./ui/UiInput";
import { saveFile } from "@/utils/fs";
import { invoke } from "@tauri-apps/api";
import { useRoute, useRouter } from "vue-router";

export const ClientCreate = defineComponent({
  name: "ClientCreate",
  components: { UiButton, UiInput },
  setup() {
    const modalStore = useModalStore();
    const isFlash = ref<boolean>(false);
    const route = useRoute();
    const router = useRouter();

    const client = reactive<newClientT>({
      fullname: String(),
      phone: String(),
      email: String(),
      address: String(),
      image: String(),
    });

    const updateQueryParams = (query: Record<any, any>) => {
      router.push({
        path: route.path,
        params: { ...route.params },
        query: { ...route.query, ...query },
      });
    };

    const createNewClient = async () => {
      isFlash.value = true;
      if (client.fullname !== "") {
        try {
          let image: string = await saveFile(client.image as string, "Image");
          await invoke("insert_client", { client });
          updateQueryParams({ refresh: true });
        } catch (error) {
          console.log(error);
        } finally {
          modalStore.updateModal({ key: "show", value: false });
        }
      }
      setTimeout(() => {
        isFlash.value = false;
      }, 1000);
    };
    return () => (
      <div class="w-1/2 h-fit z-50 gap-3 rounded-md flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Clients.create.title")}
        </h1>
        <div class="h-full w-full flex  flex-col gap-2">
          <div class="w-full h-fit flex justify-center">
            <UiUploader
              name="Image"
              extensions={ImagesFiles}
              onSave={(image) => (client.image = image)}
            />
          </div>
          <UiInput
            IsEmpty={isFlash.value && client["fullname"] == ""}
            OnInputChange={(value) =>
              (client["fullname"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Clients.create.placeholders[0]")}
          />
          <UiInput
            IsEmpty={isFlash.value && client["email"] == ""}
            OnInputChange={(value) =>
              (client["email"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Clients.create.placeholders[1]")}
          />
          <UiInput
            IsEmpty={isFlash.value && client["phone"] == ""}
            OnInputChange={(value) =>
              (client["phone"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Clients.create.placeholders[2]")}
          />
          <UiInput
            IsEmpty={isFlash.value && client["address"] == ""}
            OnInputChange={(value) =>
              (client["address"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Clients.create.placeholders[3]")}
          />
        </div>
        <div class="flex">
          <UiButton colorTheme="a" Click={() => createNewClient()}>
            {globalTranslate("Clients.create.button")}
          </UiButton>
        </div>
      </div>
    );
  },
});
