import { defineComponent, onBeforeUnmount } from "vue";
import { useSellerStore } from "@/stores/sellerStore";
import { useModalStore } from "@/stores/modalStore";
import { UiButton } from "./ui/UiButton";
import { storeToRefs } from "pinia";
import { globalTranslate } from "@/utils/globalTranslate";

export const SellerDelete = defineComponent({
  name: "SellerDelete",
  components: { UiButton },
  setup(props) {
    const modalStore = useModalStore();
    const { seller } = storeToRefs(modalStore);
    const deleteTheSeller = () => {
      if (seller.value?.id) {
        useSellerStore().deleteOneSeller(seller.value?.id);
        modalStore.updateModal({ key: "show", value: false });
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
