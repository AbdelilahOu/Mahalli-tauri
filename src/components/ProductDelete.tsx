import { defineComponent, onBeforeUnmount, type PropType } from "vue";
import { useProductStore } from "@/stores/productStore";
import { useModalStore } from "@/stores/modalStore";
import { storeToRefs } from "pinia";
import { UiButton } from "./ui/UiButton";
import { globalTranslate } from "@/utils/globalTranslate";

export const ProductDelete = defineComponent({
  name: "ProductDelete",
  components: { UiButton },
  setup() {
    const modalStore = useModalStore();
    const { product } = storeToRefs(modalStore);
    console.log(product);
    const deleteTheProduct = () => {
      if (product.value?.id) {
        useProductStore().deleteOneProduct(product.value?.id);
        modalStore.updateModal({ key: "show", value: false });
      }
    };
    onBeforeUnmount(() => modalStore.updateProductRow(null));
    return () => (
      <div class="w-1/2 h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Products.delete.title")} {product.value?.name} ?
        </h1>
        <div class="flex gap-2">
          <UiButton colorTheme="a" onClick={() => deleteTheProduct()}>
            {globalTranslate("Products.delete.yes")}
          </UiButton>
          <UiButton
            onClick={() =>
              modalStore.updateModal({ key: "show", value: false })
            }
          >
            {globalTranslate("Products.delete.no")}
          </UiButton>
        </div>
      </div>
    );
  },
});
