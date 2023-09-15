import { globalTranslate } from "@/utils/globalTranslate";
import { computed, defineComponent, onBeforeUnmount } from "vue";
import { store } from "@/store";
import { UiButton } from "./ui/UiButton";
import { invoke } from "@tauri-apps/api";

import { useRoute, useRouter } from "vue-router";
import type { orderT } from "@/types";

export const OrderDelete = defineComponent({
  name: "OrderDelete",
  components: { UiButton },
  setup() {
    const route = useRoute();
    const router = useRouter();
    //

    const order = computed(() => store.getters.getSelectedRow<orderT>());
    //
    const updateQueryParams = (query: Record<any, any>) => {
      router.push({
        path: route.path,
        params: { ...route.params },
        query: { ...route.query, ...query },
      });
    };

    const deleteTheOrders = async () => {
      const id = order.value?.id;
      if (id) {
        try {
          await invoke("delete_order", { id });
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
    //
    onBeforeUnmount(() =>
      store.setters.updateStore({ key: "row", value: null })
    );
    return () => (
      <div class="w-1/2 h-fit rounded-[4px] z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Orders.delete.title")}n° {order.value?.id} ?
        </h1>
        <div class="flex gap-2">
          <UiButton colorTheme="a" Click={() => deleteTheOrders()}>
            {globalTranslate("Orders.delete.yes")}
          </UiButton>
          <UiButton
            Click={() =>
              store.setters.updateStore({ key: "show", value: false })
            }
          >
            {globalTranslate("Orders.delete.no")}
          </UiButton>
        </div>
      </div>
    );
  },
});
