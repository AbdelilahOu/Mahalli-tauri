import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { computed, defineComponent, onBeforeUnmount } from "vue";
import { globalTranslate } from "@/utils/globalTranslate";
import { Button } from "./ui/button";
import { invoke } from "@tauri-apps/api";
import type { clientT } from "@/types";
import { store } from "@/store";

export const ClientDelete = defineComponent({
  name: "ClientDelete",
  components: { Button },
  setup() {
    const { updateQueryParams } = useUpdateRouteQueryParams();
    const client = computed(() => store.getters.getSelectedRow<clientT>());

    const deleteTheClient = async () => {
      const id = client.value?.id;
      if (id) {
        try {
          await invoke("delete_client", { id });
          // toggle refresh
          updateQueryParams({
            refresh: "refresh-delete-" + Math.random() * 9999,
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
          {globalTranslate("Clients.delete.title")} {client.value?.fullname} ?
        </h1>
        <div class="flex gap-2">
          <Button onClick={() => deleteTheClient()}>
            {globalTranslate("Clients.delete.yes")}
          </Button>
          <Button
            onClick={() =>
              store.setters.updateStore({ key: "show", value: false })
            }
          >
            {globalTranslate("Clients.delete.no")}
          </Button>
        </div>
      </div>
    );
  },
});
