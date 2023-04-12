import { defineComponent, onBeforeMount, ref, Transition } from "vue";
import { ProductTable } from "@/components/ProductTable";
import { useProductStore } from "@/stores/productStore";
import { UiButton } from "@/components/ui/UiButton";
import { useModalStore } from "@/stores/modalStore";
import { UiInput } from "@/components/ui/UiInput";
import UiIcon from "@/components/ui/UiIcon.vue";
import { storeToRefs } from "pinia";
import { globalTranslate } from "@/utils/globalTranslate";

export const ProductView = defineComponent({
  name: "Products",
  components: {
    ProductTable,
    UiButton,
    UiInput,
    UiIcon,
  },
  setup() {
    const modalStore = useModalStore();
    const productStore = useProductStore();
    const { products } = storeToRefs(productStore);
    //
    const searchQuery = ref<string>("");
    //
    const updateModal = (name: string) => {
      modalStore.updateModal({ key: "show", value: true });
      modalStore.updateModal({ key: "name", value: name });
    };
    //
    const sortProductBy = (by: string) => "";
    //
    onBeforeMount(() => {
      productStore.getAllProducts();
    });
    return () => (
      <main class="w-full h-full px-3">
        <div class="w-full h-full flex flex-col items-start justify-start">
          <Transition appear>
            <div class="flex justify-between w-full gap-9 my-1">
              <div class="w-1/3">
                <UiInput
                  IsEmpty={false}
                  OnInputChange={(value) =>
                    (searchQuery.value =
                      typeof value !== "string"
                        ? JSON.stringify(value).toLocaleLowerCase()
                        : value.toLocaleLowerCase())
                  }
                  Type="text"
                  PlaceHolder={globalTranslate("Global.search")}
                >
                  <UiIcon
                    class=" fill-gray-400 cursor-default hover:bg-white"
                    name="search"
                  />
                </UiInput>
              </div>
              <div class="w-1/4 flex gap-2">
                <UiButton
                  colorTheme="a"
                  onClick={() => updateModal("ProductCreate")}
                >
                  <UiIcon
                    class=" fill-gray-900 cursor-default hover:bg-transparent"
                    name="add"
                  />{" "}
                  {globalTranslate("Products.index.addButton")}
                </UiButton>
              </div>
            </div>
          </Transition>
          <Transition appear>
            <ProductTable
              FilterParam={searchQuery.value}
              sortBy={(by: string) => sortProductBy(by)}
              Products={products.value}
            />
          </Transition>
        </div>
      </main>
    );
  },
});
