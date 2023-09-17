import { defineComponent, reactive, onBeforeUnmount, computed } from "vue";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { CLIENT_UPDATE } from "@/constants/defaultValues";
import { globalTranslate } from "@/utils/globalTranslate";
import type { clientT, updateClientT } from "@/types";
import { UiUpdateInput } from "./ui/UiUpdateInput";
import { UiButton } from "./ui/UiButton";
import { invoke } from "@tauri-apps/api";
import { store } from "@/store";

export const ClientUpdate = defineComponent({
  name: "ClientUpdate",
  components: { UiButton, UiUpdateInput },
  setup() {
    const ClientRow = computed(() => store.getters.getSelectedRow<clientT>());
    const { updateQueryParams } = useUpdateRouteQueryParams();

    const updateClient = reactive<updateClientT>(
      ClientRow.value ? ClientRow.value : CLIENT_UPDATE
    );

    const updateTheClient = async () => {
      if (updateClient.id) {
        try {
          await invoke("update_client", {
            client: updateClient,
            id: updateClient.id,
          });
          // toggle refresh
          updateQueryParams({
            refresh: "refresh-update-" + Math.random() * 9999,
          });
        } catch (error) {
          console.log(error);
        } finally {
          store.setters.updateStore({ key: "show", value: false });
        }
      }
    };

    onBeforeUnmount(() =>
      store.setters.updateStore({ key: "row", value: null })
    );

    return () => (
      <div class="w-1/2 h-fit rounded-[4px] z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Clients.update.title")}
        </h1>
        <div class="h-full w-full flex flex-col gap-2">
          <UiUpdateInput
            Value={ClientRow.value?.["fullname"]}
            OnInputChange={(value) =>
              (updateClient["fullname"] =
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
            Value={ClientRow.value?.address}
            OnInputChange={(value) =>
              (updateClient["address"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Clients.create.placeholders[3]")}
          />
        </div>
        <div class="flex">
          <UiButton colorTheme="a" Click={() => updateTheClient()}>
            {globalTranslate("Clients.update.button")} {updateClient.name}
          </UiButton>
        </div>
      </div>
    );
  },
});
