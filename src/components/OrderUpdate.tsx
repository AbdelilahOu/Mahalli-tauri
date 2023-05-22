import { globalTranslate } from "@/utils/globalTranslate";
import { useOrdersStore } from "@/stores/orderStore";
import { useProductStore } from "@/stores/productStore";
import { useSellerStore } from "@/stores/sellerStore";
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
  withModifiers,
} from "vue";

export const OrderUpdate = defineComponent({
  name: "OrderUpdate",
  components: { UiButton, UiUpdateInput, UiIcon, UiUpdateSelect, UiCheckBox },
  setup() {
    //
    const productStore = useProductStore();
    const sellerStore = useSellerStore();
    const modalStore = useModalStore();
    //
    const { order: OrdersRow } = storeToRefs(modalStore);

    const { products } = storeToRefs(productStore);
    const { sellers } = storeToRefs(sellerStore);
    const IsClicked = ref<boolean>(false);
    //
    const Orders: updateOrdersT = {
      id: undefined,
      status: undefined,
      seller_id: undefined,
      orderItems: [],
    };
    //
    const updateOrders = reactive<updateOrdersT>(
      OrdersRow.value ? OrdersRow.value : Orders
    );
    //
    const updateTheOrders = () => {
      if (updateOrders.id) {
        console.log(updateOrders);
        useOrdersStore().updateOneOrders(updateOrders.id, updateOrders);
        modalStore.updateModal({ key: "show", value: false });
      }
    };
    onBeforeUnmount(() => modalStore.updateOrdersRow(null));

    return () => (
      <div
        onClick={withModifiers(
          () => (IsClicked.value = !IsClicked.value),
          ["self"]
        )}
        class="w-5/6 lg:w-1/2 relative h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]"
      >
        <h1
          onClick={withModifiers(
            () => (IsClicked.value = !IsClicked.value),
            ["self"]
          )}
          class="font-semibold  text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center"
        >
          {globalTranslate("Orders.update.title")} N° {updateOrders.id}
        </h1>
        <div class="h-full  w-full grid grid-cols-1 gap-2">
          <div class="w-full  h-full flex flex-col gap-1">
            <h1 class="font-medium">
              {globalTranslate("Orders.update.details.seller.title")}
            </h1>
            <UiUpdateSelect
              Value={
                sellers.value.find((cli) => updateOrders.seller_id === cli.id)
                  ?.name ?? ""
              }
              items={sellers.value.map((seller) => ({
                name: seller.name,
                id: seller.id,
              }))}
              onSelect={(id: number) => (updateOrders.seller_id = id)}
              IsClickedOuside={IsClicked.value}
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
                        ? (updateOrders.status = "delivered")
                        : (updateOrders.status = "")
                    }
                  />
                  <span>{globalTranslate("Orders.status.delivered")}</span>
                </div>
                <div class="h-full w-full flex flex-row flex-nowrap items-center justify-center gap-2">
                  <UiCheckBox
                    onCheck={(check) =>
                      check
                        ? (updateOrders.status = "pending")
                        : (updateOrders.status = "")
                    }
                  />
                  <span>{globalTranslate("Orders.status.pending")}</span>
                </div>
                <div class="h-full w-full flex flex-row justify-end flex-nowrap items-center gap-2">
                  <UiCheckBox
                    onCheck={(check) =>
                      check
                        ? (updateOrders.status = "canceled")
                        : (updateOrders.status = "")
                    }
                  />
                  <span>{globalTranslate("Orders.status.canceled")}</span>
                </div>
              </div>
            </div>
            <div
              onClick={withModifiers(
                () => (IsClicked.value = !IsClicked.value),
                ["self"]
              )}
              class="w-full  h-full flex flex-col gap-1"
            >
              <UiButton
                Click={() =>
                  updateOrders.orderItems?.push({
                    product_id: 0,
                    quantity: 0,
                  })
                }
              >
                {globalTranslate("Orders.update.details.order.add")}
              </UiButton>
              <div class="w-full grid grid-cols-[1fr_1fr_1fr_36px] pb-10 overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1">
                <div class="flex flex-col gap-2">
                  {updateOrders.orderItems?.map((item, index) => (
                    <UiUpdateSelect
                      Value={
                        products.value.find((pro) => pro.id == item.product_id)
                          ?.name ?? ""
                      }
                      items={products.value.map((product) => ({
                        name: product.name,
                        id: product.id,
                      }))}
                      onSelect={(id: number) => (item.product_id = id)}
                      IsClickedOuside={IsClicked.value}
                    >
                      {globalTranslate("Orders.update.details.order.select")}
                    </UiUpdateSelect>
                  ))}
                </div>
                <div class="flex flex-col gap-2">
                  {updateOrders.orderItems?.map((item, index) => (
                    <div class="h-full flex w-full items-center relative">
                      <UiUpdateInput
                        class="border-r-0"
                        Value={item.quantity}
                        PlaceHolder={globalTranslate(
                          "Orders.create.details.order.placeholder[0]"
                        )}
                        Type="number"
                        OnInputChange={(value) =>
                          (updateOrders.orderItems[index].quantity =
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
                  {updateOrders.orderItems?.map((item, index) => (
                    <div class="h-full flex w-full items-center relative">
                      <UiUpdateInput
                        class="border-r-0 "
                        Value={item.price}
                        PlaceHolder={globalTranslate(
                          "Orders.create.details.order.placeholder[1]"
                        )}
                        Type="number"
                        OnInputChange={(value) =>
                          (updateOrders.orderItems[index].price = Number(value))
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
                  {updateOrders.orderItems?.map((item, index) => (
                    <div
                      onClick={() => {
                        updateOrders.orderItems?.splice(index, 1);
                        if (item.id)
                          useOrdersStore().deleteOneOrdersItem(item.id);
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
