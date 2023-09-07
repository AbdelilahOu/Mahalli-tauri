import { globalTranslate } from "@/utils/globalTranslate";
import { defineComponent, onBeforeUnmount } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { UiButton } from "./ui/UiButton";
import { invoke } from "@tauri-apps/api";
import { storeToRefs } from "pinia";

export const OrderDelete = defineComponent({
  name: "OrderDelete",
  components: { UiButton },
  setup() {
    //
    const modalStore = useModalStore();
    const { order } = storeToRefs(modalStore);
    //
    const deleteTheOrders = async () => {
      const id = order.value?.id;
      if (id) {
        try {
          await invoke("delete_order", { id });
        } catch (error) {
          console.log(error);
        } finally {
          modalStore.updateModal({ key: "show", value: false });
        }
      }
    };
    //
    onBeforeUnmount(() => modalStore.updateOrdersRow(null));
    return () => (
      <div class="w-1/2 h-fit rounded-md z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Orders.delete.title")}n° {order.value?.id} ?
        </h1>
        <div class="flex gap-2">
          <UiButton colorTheme="a" Click={() => deleteTheOrders()}>
            {globalTranslate("Orders.delete.yes")}
          </UiButton>
          <UiButton
            Click={() => modalStore.updateModal({ key: "show", value: false })}
          >
            {globalTranslate("Orders.delete.no")}
          </UiButton>
        </div>
      </div>
    );
  },
});
