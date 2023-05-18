import { globalTranslate } from "@/utils/globalTranslate";
import { useClientStore } from "@/stores/clientStore";
import { defineComponent, reactive, ref } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { ImagesFiles } from "@/constants/FileTypes";
import { UiUploader } from "./ui/UiUploader";
import type { newClientT } from "@/types";
import { UiButton } from "./ui/UiButton";
import { UiInput } from "./ui/UiInput";

export const ClientCreate = defineComponent({
  name: "ClientCreate",
  components: { UiButton, UiInput },
  setup() {
    const modalStore = useModalStore();
    const isFlash = ref<boolean>(false);
    const Client = reactive<newClientT>({
      name: String(),
      email: String(),
      phone: String(),
      address: String(),
      image: String(),
    });
    const createNewClient = () => {
      isFlash.value = true;
      if (Client.name !== "") {
        useClientStore().createOneClient(Client);
        modalStore.updateModal({ key: "show", value: false });
      }
      setTimeout(() => {
        isFlash.value = false;
      }, 1000);
    };
    return () => (
      <div class="w-1/2 h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Clients.create.title")}
        </h1>
        <div class="h-full w-full flex  flex-col gap-2">
          <div class="w-full h-fit flex justify-center">
            <UiUploader
              name="Image"
              extensions={ImagesFiles}
              onSave={(image) => (Client.image = image)}
            />
          </div>
          <UiInput
            IsEmpty={isFlash.value && Client["name"] == ""}
            OnInputChange={(value) =>
              (Client["name"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Clients.create.placeholders[0]")}
          />
          <UiInput
            IsEmpty={isFlash.value && Client["email"] == ""}
            OnInputChange={(value) =>
              (Client["email"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Clients.create.placeholders[1]")}
          />
          <UiInput
            IsEmpty={isFlash.value && Client["phone"] == ""}
            OnInputChange={(value) =>
              (Client["phone"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Clients.create.placeholders[2]")}
          />
          <UiInput
            IsEmpty={isFlash.value && Client["address"] == ""}
            OnInputChange={(value) =>
              (Client["address"] =
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
