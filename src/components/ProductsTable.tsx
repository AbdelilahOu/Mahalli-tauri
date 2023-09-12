import { defineComponent, ref, type PropType } from "vue";
import { globalTranslate } from "@/utils/globalTranslate";
import { store } from "@/store";
import { UiPagination } from "./ui/UiPagination";
import { UiCheckBox } from "./ui/UiCheckBox";
import type { productT } from "@/types";
import UiIcon from "./ui/UiIcon.vue";
import { convertFileSrc } from "@tauri-apps/api/tauri";

export const ProductsTable = defineComponent({
  name: "ProductsTable",
  components: { UiCheckBox, UiIcon, UiPagination },
  props: {
    Products: {
      type: Array as PropType<productT[]>,
      required: true,
    },
  },
  setup(props) {
    //

    //
    const toggleThisProduct = (product: productT, name: string) => {
      store.setters.updateStore({ key: "row", value: product });
      store.setters.updateStore({ key: "name", value: name });
      store.setters.updateStore({ key: "show", value: true });
    };
    return () => (
      <div class="w-full flex flex-col">
        <table class="table-auto  w-full">
          <thead class="text-xs h-9 font-semibold uppercase text-[rgba(25,23,17,0.6)] bg-gray-300">
            <tr>
              <th class="rounded-l-md"></th>
              <th class="p-2 w-fit"></th>
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <th class="p-2 w-fit last:rounded-r-md">
                  <div class="font-semibold  text-left">
                    {globalTranslate(`Products.index.feilds[${index}]`)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-gray-100">
            {props.Products.map((product, index) => (
              <tr v-fade={index} key={product.id}>
                <td class="p-2">
                  <span class="h-full w-full grid">
                    <UiCheckBox
                      onCheck={(check) =>
                        console.log(
                          product.name,
                          check ? "is checked" : "is unchecked"
                        )
                      }
                    />
                  </span>
                </td>
                <td class="p-2">
                  <div class="w-12 h-12 rounded-full overflow-hidden">
                    {product.image && product.image !== "" ? (
                      <img
                        class="rounded-full w-full h-full object-cover"
                        src={convertFileSrc(product.image)}
                      />
                    ) : (
                      <span class=" rounded-full w-full h-full object-fill animate-pulse bg-slate-300 duration-150" />
                    )}
                  </div>
                </td>
                <td class="p-2">
                  <div class="font-medium text-gray-800">{product.name}</div>
                </td>
                <td class="p-2">
                  <div class="font-medium text-gray-800">
                    {product.description}
                  </div>
                </td>
                <td class="p-2">
                  <div class="text-left">{product.price.toFixed(2)} DH</div>
                </td>
                <td class="p-2">
                  <div class="text-left">{product.tva.toFixed(2)} %</div>
                </td>
                <td class="p-2">
                  <div class="text-left">{product?.quantity} item</div>
                </td>
                <td class="p-2">
                  <div class="flex  justify-start gap-3">
                    <span
                      onClick={() =>
                        toggleThisProduct(product, "ProductDelete")
                      }
                    >
                      <UiIcon name={"delete"} />
                    </span>
                    <span
                      onClick={() =>
                        toggleThisProduct(product, "ProductUpdate")
                      }
                    >
                      <UiIcon name={"edit"} />
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <UiPagination />
        </div>
      </div>
    );
  },
});
