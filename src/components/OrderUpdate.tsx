import { globalTranslate } from "@/utils/globalTranslate";
import { UiUpdateSelect } from "./ui/UiUpdateSelect";
import { useModalStore } from "@/stores/modalStore";
import { UiUpdateInput } from "./ui/UiUpdateInput";
import type { updateOrdersT } from "@/types";
import { UiCheckBox } from "./ui/UiCheckBox";
import { UiButton } from "./ui/UiButton";
import UiIcon from "./ui/UiIcon.vue";
import { storeToRefs } from "pinia";
import {
  defineComponent,
  reactive,
  onBeforeUnmount,
  ref,
  onBeforeMount,
} from "vue";
import { invoke } from "@tauri-apps/api";

export const OrderUpdate = defineComponent({
  name: "OrderUpdate",
  components: { UiButton, UiUpdateInput, UiIcon, UiUpdateSelect, UiCheckBox },
  setup() {
    //
    const modalStore = useModalStore();
    //
    const { order: OrdersRow } = storeToRefs(modalStore);

    const sellers = ref<{ name: string; id: number }[]>([]);
    const products = ref<{ name: string; id: number }[]>([]);
    //

    const Orders: updateOrdersT = {
      id: undefined,
      status: undefined,
      seller_id: undefined,
      orderItems: [],
    };
    //
    const updateOrder = reactive<updateOrdersT>(
      OrdersRow.value ? OrdersRow.value : Orders
    );
    //

    onBeforeMount(async () => {
      const res = await Promise.allSettled([
        invoke<{ name: string; id: number }[]>("get_all_sellers"),
        invoke<{ name: string; id: number }[]>("get_all_products"),
      ]);

      // @ts-ignore
      if ((res[0].status = "fulfilled")) sellers.value = res[0].value;
      // @ts-ignore
      if ((res[1].status = "fulfilled")) products.value = res[1].value;
    });

    const updateTheOrders = async () => {
      if (updateOrder.id) {
        try {
          await invoke("update_order", {
            order: updateOrder,
            id: updateOrder.id,
          });
        } catch (error) {
          console.log(error);
        } finally {
          modalStore.updateModal({ key: "show", value: false });
        }
      }
    };

    async function deleteOneOrderItem(id: number) {
      try {
        await invoke("delete_order_items", { id });
      } catch (error) {
        console.log(error);
      }
    }

    onBeforeUnmount(() => modalStore.updateOrdersRow(null));

    return () => (
      <div class="w-5/6 lg:w-1/2 relative h-fit rounded-md z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold  text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Orders.update.title")} N° {updateOrder.id}
        </h1>
        <div class="h-full  w-full grid grid-cols-1 gap-2">
          <div class="w-full  h-full flex flex-col gap-1">
            <h1 class="font-medium">
              {globalTranslate("Orders.update.details.seller.title")}
            </h1>
            <UiUpdateSelect
              Value={updateOrder.seller?.name ?? "Select a seller"}
              items={sellers.value.map((seller) => ({
                name: seller.name,
                id: seller.id,
              }))}
              onSelect={(id: number) => (updateOrder.seller_id = id)}
            >
              {globalTranslate("Orders.update.details.seller.select")}
            </UiUpdateSelect>
          </div>
          <div class="w-full  h-full flex flex-col gap-1">
            <h1 class="font-medium">
              {globalTranslate("Orders.update.details.order.title")}
            </h1>
            <div class="w-full  h-full flex flex-col mb-1 gap-1">
              <div class="flex justify-between w-full">
                <div class="h-full w-full flex flex-row flex-nowrap items-center gap-2">
                  <UiCheckBox
                    onCheck={(check) =>
                      check
                        ? (updateOrder.status = "delivered")
                        : (updateOrder.status = "")
                    }
                  />
                  <span>{globalTranslate("Orders.status.delivered")}</span>
                </div>
                <div class="h-full w-full flex flex-row flex-nowrap items-center justify-center gap-2">
                  <UiCheckBox
                    onCheck={(check) =>
                      check
                        ? (updateOrder.status = "pending")
                        : (updateOrder.status = "")
                    }
                  />
                  <span>{globalTranslate("Orders.status.pending")}</span>
                </div>
                <div class="h-full w-full flex flex-row justify-end flex-nowrap items-center gap-2">
                  <UiCheckBox
                    onCheck={(check) =>
                      check
                        ? (updateOrder.status = "canceled")
                        : (updateOrder.status = "")
                    }
                  />
                  <span>{globalTranslate("Orders.status.canceled")}</span>
                </div>
              </div>
            </div>
            <div class="w-full  h-full flex flex-col gap-1">
              <UiButton
                Click={() =>
                  updateOrder.orderItems?.push({
                    product_id: 0,
                    quantity: 0,
                  })
                }
              >
                {globalTranslate("Orders.update.details.order.add")}
              </UiButton>
              <div class="w-full grid grid-cols-[1fr_1fr_1fr_36px] pb-10 overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1">
                <div class="flex flex-col gap-2">
                  {updateOrder.orderItems?.map((item, index) => (
                    <UiUpdateSelect
                      Value={item.product?.name ?? "select a product"}
                      items={products.value.map((product) => ({
                        name: product.name,
                        id: product.id,
                      }))}
                      onSelect={(id: number) => (item.product_id = id)}
                    >
                      {globalTranslate("Orders.update.details.order.select")}
                    </UiUpdateSelect>
                  ))}
                </div>
                <div class="flex flex-col gap-2">
                  {updateOrder.orderItems?.map((item, index) => (
                    <div class="h-full flex w-full items-center relative">
                      <UiUpdateInput
                        class="border-r-0"
                        Value={item.quantity}
                        PlaceHolder={globalTranslate(
                          "Orders.create.details.order.placeholder[0]"
                        )}
                        Type="number"
                        OnInputChange={(value) =>
                          (updateOrder.orderItems[index].quantity =
                            Number(value))
                        }
                      >
                        {{
                          unite: () => (
                            <span class="h-full text-gray-400 rounded-md px-2 border-r-2  flex items-center justify-center">
                              Item
                            </span>
                          ),
                        }}
                      </UiUpdateInput>
                    </div>
                  ))}
                </div>
                <div class="flex flex-col gap-2">
                  {updateOrder.orderItems?.map((item, index) => (
                    <div class="h-full flex w-full items-center relative">
                      <UiUpdateInput
                        class="border-r-0 "
                        Value={item.price}
                        PlaceHolder={globalTranslate(
                          "Orders.create.details.order.placeholder[1]"
                        )}
                        Type="number"
                        OnInputChange={(value) =>
                          (updateOrder.orderItems[index].price = Number(value))
                        }
                      >
                        {{
                          unite: () => (
                            <span class="h-full text-gray-400 rounded-md px-2 border-r-2  flex items-center justify-center">
                              DH
                            </span>
                          ),
                        }}
                      </UiUpdateInput>
                    </div>
                  ))}
                </div>
                <div class="flex flex-col gap-2">
                  {updateOrder.orderItems?.map((item, index) => (
                    <div
                      onClick={() => {
                        updateOrder.orderItems?.splice(index, 1);
                        if (item.id) deleteOneOrderItem(item.id);
                      }}
                      class="flex justify-center bg-gray-100 hover:bg-gray-300 transition-all duration-200  rounded-md items-center w-full h-full"
                    >
                      <UiIcon name="delete" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex">
          <UiButton colorTheme="a" Click={() => updateTheOrders()}>
            {globalTranslate("Orders.update.button")}
          </UiButton>
        </div>
      </div>
    );
  },
});
