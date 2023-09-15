import { computed, defineComponent, onBeforeUnmount } from "vue";
import { UiButton } from "./ui/UiButton";
import { globalTranslate } from "@/utils/globalTranslate";
import { useRoute, useRouter } from "vue-router";
import { invoke } from "@tauri-apps/api";
import { store } from "@/store";
import type { clientT } from "@/types";

export const ClientDelete = defineComponent({
  name: "ClientDelete",
  components: { UiButton },
  setup() {
    const client = computed(() => store.getters.getSelectedRow<clientT>());
    const route = useRoute();
    const router = useRouter();

    const updateQueryParams = (query: Record<any, any>) => {
      router.push({
        path: route.path,
        params: { ...route.params },
        query: { ...route.query, ...query },
      });
    };

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
          <UiButton colorTheme="a" Click={() => deleteTheClient()}>
            {globalTranslate("Clients.delete.yes")}
          </UiButton>
          <UiButton
            Click={() =>
              store.setters.updateStore({ key: "show", value: false })
            }
          >
            {globalTranslate("Clients.delete.no")}
          </UiButton>
        </div>
      </div>
    );
  },
});
