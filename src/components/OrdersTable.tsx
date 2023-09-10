import { defineComponent, type PropType, ref } from "vue";
import { globalTranslate } from "@/utils/globalTranslate";
import { store } from "@/store";
import { UiPagination } from "./ui/UiPagination";
import { UiCheckBox } from "./ui/UiCheckBox";
import { RouterLink } from "vue-router";
import type { orderT } from "@/types";
import UiIcon from "./ui/UiIcon.vue";

export const OrdersTable = defineComponent({
  name: "OrdersTable",
  props: {
    Orders: {
      type: Array as PropType<orderT[]>,
      required: true,
    },
  },
  components: { UiCheckBox, UiIcon, UiPagination },
  setup(props) {
    const checkedOrders = ref<number[]>([]);

    const checkThisOrders = (IsIncluded: boolean, id: number) => {
      IsIncluded
        ? checkedOrders.value.push(id)
        : checkedOrders.value.splice(checkedOrders.value.indexOf(id), 1);
    };

    const toggleThisOrders = (Order: orderT, name: string) => {
      store.setters.updateStore({ key: "row", value: Order });
      store.setters.updateStore({ key: "name", value: name });
      store.setters.updateStore({ key: "show", value: true });
    };
    //

    return () => (
      <div class="flex flex-col w-full h-full">
        <table class="table-auto  w-full">
          <thead class="text-xs h-9  font-semibold uppercase text-[rgba(25,23,17,0.6)] bg-gray-300">
            <tr>
              <th class="rounded-l-md"></th>
              {[1, 2, 3, 4, 5].map((index) => (
                <th class="p-2 w-fit last:rounded-r-md ">
                  <div class="font-semibold text-left">
                    {globalTranslate(`Orders.index.feilds[${index}]`)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-gray-100">
            {props.Orders.map((Orders, index) => (
              <tr v-fade={index} key={Orders.id}>
                <td class="p-2">
                  <span class="h-full w-full grid">
                    <UiCheckBox
                      onCheck={(check) => checkThisOrders(check, Orders.id)}
                    />
                  </span>
                </td>

                <td class="p-2">
                  <div class="text-left whitespace-nowrap overflow-ellipsis">
                    <RouterLink
                      to={{
                        name: "SellerDetails",
                        params: {
                          id: Orders.seller_id,
                        },
                      }}
                    >
                      {Orders.seller.name}
                    </RouterLink>
                  </div>
                </td>
                <td class="p-2">
                  <div class="text-left whitespace-nowrap overflow-ellipsis">
                    {Orders.order_items?.length ? (
                      <span>
                        {Orders.order_items?.length}{" "}
                        {Orders.order_items?.length == 1
                          ? " Product"
                          : " Products"}
                      </span>
                    ) : (
                      <span class="text-red-400">No products</span>
                    )}
                  </div>
                </td>
                <td class="p-2">
                  <div class="text-left font-medium uppercase whitespace-nowrap overflow-ellipsis">
                    {Orders.status ? (
                      <span
                        class={`px-2 py-[1px] rounded-full ${
                          Orders.status == "pending"
                            ? "bg-yellow-300/60 text-yellow-800"
                            : Orders.status == "delivered"
                            ? "bg-green-300/60 text-green-800"
                            : "bg-red-300/60 text-red-800"
                        }`}
                      >
                        {globalTranslate(
                          `Orders.status.${Orders.status.toLowerCase()}`
                        )}
                      </span>
                    ) : (
                      <span class="text-red-400">No status</span>
                    )}
                  </div>
                </td>
                <td class="p-2">
                  <div class="text-left whitespace-nowrap overflow-ellipsis">
                    {Orders.created_at ?? (
                      <span class="text-red-400">No date</span>
                    )}
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex  justify-start gap-3">
                    <span
                      onClick={() => toggleThisOrders(Orders, "OrderDelete")}
                    >
                      <UiIcon name={"delete"} />
                    </span>
                    <span
                      onClick={() => toggleThisOrders(Orders, "OrderUpdate")}
                    >
                      <UiIcon name={"edit"} />
                    </span>
                    <RouterLink
                      to={{
                        name: "OrdersDetails",
                        params: { id: Orders.id },
                      }}
                    >
                      <UiIcon name={"print"} />
                    </RouterLink>
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
