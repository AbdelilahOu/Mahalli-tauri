import { defineComponent, onBeforeUnmount } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { UiButton } from "./ui/UiButton";
import { storeToRefs } from "pinia";
import { globalTranslate } from "@/utils/globalTranslate";
import { invoke } from "@tauri-apps/api";

export const SellerDelete = defineComponent({
  name: "SellerDelete",
  components: { UiButton },
  setup(props) {
    const modalStore = useModalStore();
    const { seller } = storeToRefs(modalStore);
    const deleteTheSeller = async () => {
      let id = seller.value?.id;
      if (id) {
        try {
          await invoke("delete_seller", { id });
        } catch (error) {
          console.log(error);
        } finally {
          modalStore.updateModal({ key: "show", value: false });
        }
      }
    };
    onBeforeUnmount(() => modalStore.updateSellerRow(null));
    return () => (
      <div class="w-1/2 h-fit rounded-md z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Sellers.delete.title")}
          {seller.value?.name} ?
        </h1>
        <div class="flex gap-2">
          <UiButton colorTheme="a" Click={() => deleteTheSeller()}>
            {globalTranslate("Sellers.delete.yes")}
          </UiButton>
          <UiButton
            Click={() => modalStore.updateModal({ key: "show", value: false })}
          >
            {globalTranslate("Sellers.delete.no")}
          </UiButton>
        </div>
      </div>
    );
  },
});
