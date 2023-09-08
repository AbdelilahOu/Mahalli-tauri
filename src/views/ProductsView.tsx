import { defineComponent, onBeforeMount, ref, Transition } from "vue";
import { globalTranslate } from "@/utils/globalTranslate";
import { ProductsTable } from "@/components/ProductsTable";
import { UiButton } from "@/components/ui/UiButton";
import { useModalStore } from "@/stores/modalStore";
import { UiInput } from "@/components/ui/UiInput";
import UiIcon from "@/components/ui/UiIcon.vue";
import type { productT } from "@/types";
import { invoke } from "@tauri-apps/api";

export const ProductsView = defineComponent({
  name: "Products",
  components: {
    ProductsTable,
    UiButton,
    UiInput,
    UiIcon,
  },
  setup() {
    const modalStore = useModalStore();
    //
    let products = ref<productT[]>([]);
    const searchQuery = ref<string>("");
    //
    const updateModal = (name: string) => {
      modalStore.updateModal({ key: "show", value: true });
      modalStore.updateModal({ key: "name", value: name });
    };
    //
    //
    onBeforeMount(async () => {
      try {
        let res = await invoke<productT[]>("get_products", { page: 1 });
        if (res.length) {
          products.value = res;
        }
      } catch (error) {
        console.log(error);
      }
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
                        ? JSON.stringify(value)
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
                  Click={() => updateModal("ProductCreate")}
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
            <ProductsTable
              FilterParam={searchQuery.value}
              Products={products.value}
            />
          </Transition>
        </div>
      </main>
    );
  },
});
