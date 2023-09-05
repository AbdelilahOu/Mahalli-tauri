import { defineComponent, onBeforeUnmount } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { storeToRefs } from "pinia";
import { UiButton } from "./ui/UiButton";
import { globalTranslate } from "@/utils/globalTranslate";
import { invoke } from "@tauri-apps/api";
import { useRoute, useRouter } from "vue-router";

export const ClientDelete = defineComponent({
  name: "ClientDelete",
  components: { UiButton },
  setup() {
    const modalStore = useModalStore();
    const { client } = storeToRefs(modalStore);

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
          updateQueryParams({ refresh: "refresh-delete" });
        } catch (error) {
          console.log(error);
        } finally {
          modalStore.updateModal({ key: "show", value: false });
        }
      }
    };
    onBeforeUnmount(() => modalStore.updateClientRow(null));
    return () => (
      <div class="w-1/2 h-fit rounded-md z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Clients.delete.title")} {client.value?.fullname} ?
        </h1>
        <div class="flex gap-2">
          <UiButton colorTheme="a" Click={() => deleteTheClient()}>
            {globalTranslate("Clients.delete.yes")}
          </UiButton>
          <UiButton
            Click={() => modalStore.updateModal({ key: "show", value: false })}
          >
            {globalTranslate("Clients.delete.no")}
          </UiButton>
        </div>
      </div>
    );
  },
});
