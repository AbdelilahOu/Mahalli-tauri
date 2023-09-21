import { defineComponent, reactive, onBeforeUnmount, computed } from "vue";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import type { productT, updateProductT } from "@/types";
import { Input } from "./ui/input";
import { invoke } from "@tauri-apps/api";
import { Button } from "./ui/button";
import { store } from "@/store";
import { PRODUCT_UPDATE } from "@/constants/defaultValues";

export const ProductUpdate = defineComponent({
  name: "ProductUpdate",
  components: { Button, Input },
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
          <Input
            defaultValue={ProductRow.value?.name}
            OnInputChange={(value) =>
              (updateProduct["name"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            type="text"
            placeHolder="Name"
          />
          <Input
            defaultValue={ProductRow.value?.price}
            OnInputChange={(value) => (updateProduct["price"] = Number(value))}
            type="number"
            placeHolder="Price"
          >
            {{
              unite: () => (
                <span class="h-full text-gray-400 rounded-[4px] px-2  flex items-center justify-center">
                  DH
                </span>
              ),
            }}
          </Input>
          <Input
            defaultValue={ProductRow.value?.tva}
            OnInputChange={(value) => (updateProduct["tva"] = Number(value))}
            type="number"
            placeHolder="TVA"
          />
          <Input
            defaultValue={0}
            OnInputChange={(value) =>
              (updateProduct["quantity"] = Number(value))
            }
            type="number"
            placeHolder="Add Inventory"
          >
            {{
              unite: () => (
                <span class="h-full text-gray-400 rounded-[4px] px-2  flex items-center justify-center">
                  Item
                </span>
              ),
            }}
          </Input>
          <Input
            defaultValue={ProductRow.value?.description}
            OnInputChange={(value) =>
              (updateProduct["description"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            type="text"
            placeHolder="Address"
          />
        </div>
        <div class="flex">
          <Button onClick={() => updateTheProduct()}>
            Update {updateProduct.name}
          </Button>
        </div>
      </div>
    );
  },
});
