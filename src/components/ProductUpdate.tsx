import { defineComponent, reactive, onBeforeUnmount, computed } from "vue";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import type { productT, updateProductT } from "@/types";
import { UiUpdateInput } from "./ui/UiUpdateInput";
import { invoke } from "@tauri-apps/api";
import { UiButton } from "./ui/UiButton";
import { store } from "@/store";
import { PRODUCT_UPDATE } from "@/constants/defaultValues";

export const ProductUpdate = defineComponent({
  name: "ProductUpdate",
  components: { UiButton, UiUpdateInput },
  setup() {
    const { updateQueryParams } = useUpdateRouteQueryParams();

    const ProductRow = computed(() => store.getters.getSelectedRow<productT>());

    const updateProduct = reactive<updateProductT>({
      ...(ProductRow.value ? ProductRow.value : PRODUCT_UPDATE),
      quantity: 0,
    });

    const updateTheProduct = async () => {
      if (updateProduct.id) {
        try {
          await invoke("update_product", {
            product: updateProduct,
            id: updateProduct.id,
          });
          // toggle refresh
          updateQueryParams({
            refresh: "refresh-update-" + Math.random() * 9999,
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
          Update Product
        </h1>
        <div class="h-full w-full flex flex-col gap-2">
          <UiUpdateInput
            Value={ProductRow.value?.name}
            OnInputChange={(value) =>
              (updateProduct["name"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder="Name"
          />
          <UiUpdateInput
            Value={ProductRow.value?.price}
            OnInputChange={(value) => (updateProduct["price"] = Number(value))}
            Type="number"
            PlaceHolder="Price"
          >
            {{
              unite: () => (
                <span class="h-full text-gray-400 rounded-[4px] px-2  flex items-center justify-center">
                  DH
                </span>
              ),
            }}
          </UiUpdateInput>
          <UiUpdateInput
            Value={ProductRow.value?.tva}
            OnInputChange={(value) => (updateProduct["tva"] = Number(value))}
            Type="number"
            PlaceHolder="TVA"
          />
          <UiUpdateInput
            Value={0}
            OnInputChange={(value) =>
              (updateProduct["quantity"] = Number(value))
            }
            Type="number"
            PlaceHolder="Add Inventory"
          >
            {{
              unite: () => (
                <span class="h-full text-gray-400 rounded-[4px] px-2  flex items-center justify-center">
                  Item
                </span>
              ),
            }}
          </UiUpdateInput>
          <UiUpdateInput
            Value={ProductRow.value?.description}
            OnInputChange={(value) =>
              (updateProduct["description"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder="Address"
          />
        </div>
        <div class="flex">
          <UiButton colorTheme="a" Click={() => updateTheProduct()}>
            Update {updateProduct.name}
          </UiButton>
        </div>
      </div>
    );
  },
});
