import { defineComponent, reactive, onBeforeUnmount } from "vue";
import { useClientStore } from "@/stores/clientStore";
import { useModalStore } from "@/stores/modalStore";
import { UiUpdateInput } from "./ui/UiUpdateInput";
import type { updateClientT } from "@/types";
import { UiButton } from "./ui/UiButton";
import { storeToRefs } from "pinia";
import { globalTranslate } from "@/utils/globalTranslate";

export const ClientUpdate = defineComponent({
  name: "ClientUpdate",
  components: { UiButton, UiUpdateInput },
  setup() {
    const modalStore = useModalStore();
    const { client: ClientRow } = storeToRefs(modalStore);
    const client = {
      id: undefined,
      name: undefined,
      email: undefined,
      phone: undefined,
      addresse: undefined,
    };
    const updateClient = reactive<updateClientT>(
      ClientRow.value ? ClientRow.value : client
    );
    const updateTheClient = () => {
      if (updateClient.id) {
        useClientStore().updateOneClient(updateClient.id, updateClient);
        modalStore.updateModal({ key: "show", value: false });
      }
    };
    onBeforeUnmount(() => modalStore.updateClientRow(null));

    return () => (
      <div class="w-1/2 h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Clients.update.title")}
        </h1>
        <div class="h-full w-full flex flex-col gap-2">
          <UiUpdateInput
            Value={ClientRow.value?.["name"]}
            OnInputChange={(value) =>
              (updateClient["name"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Clients.create.placeholders[0]")}
          />
          <UiUpdateInput
            Value={ClientRow.value?.email}
            OnInputChange={(value) =>
              (updateClient["email"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Clients.create.placeholders[1]")}
          />
          <UiUpdateInput
            Value={ClientRow.value?.phone}
            OnInputChange={(value) =>
              (updateClient["phone"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Clients.create.placeholders[2]")}
          />
          <UiUpdateInput
            Value={ClientRow.value?.addresse}
            OnInputChange={(value) =>
              (updateClient["addresse"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Clients.create.placeholders[3]")}
          />
        </div>
        <div class="flex">
          <UiButton colorTheme="a" onClick={() => updateTheClient()}>
            {globalTranslate("Clients.update.button")} {updateClient.name}
          </UiButton>
        </div>
      </div>
    );
  },
});
