import { defineComponent, onBeforeUnmount, type PropType } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { storeToRefs } from "pinia";
import { UiButton } from "./ui/UiButton";
import { globalTranslate } from "@/utils/globalTranslate";
import { invoke } from "@tauri-apps/api";

export const ProductDelete = defineComponent({
  name: "ProductDelete",
  components: { UiButton },
  setup() {
    const modalStore = useModalStore();

    const { product } = storeToRefs(modalStore);

    const deleteTheProduct = async () => {
      let id = product.value?.id;
      if (id) {
        try {
          await invoke("delete_product", { id });
        } catch (error) {
          console.log(error);
        } finally {
          modalStore.updateModal({ key: "show", value: false });
        }
      }
    };
    onBeforeUnmount(() => modalStore.updateProductRow(null));
    return () => (
      <div class="w-1/2 h-fit rounded-md z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Products.delete.title")} {product.value?.name} ?
        </h1>
        <div class="flex gap-2">
          <UiButton colorTheme="a" Click={() => deleteTheProduct()}>
            {globalTranslate("Products.delete.yes")}
          </UiButton>
          <UiButton
            Click={() => modalStore.updateModal({ key: "show", value: false })}
          >
            {globalTranslate("Products.delete.no")}
          </UiButton>
        </div>
      </div>
    );
  },
});
