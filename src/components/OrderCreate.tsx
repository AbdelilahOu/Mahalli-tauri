import { defineComponent, reactive, ref, withModifiers } from "vue";
import type { newOrdersT, newOrdersItemT } from "@/types";
import { useOrdersStore } from "@/stores/orderStore";
import { useProductStore } from "@/stores/productStore";
import { useSellerStore } from "@/stores/sellerStore";
import { useModalStore } from "@/stores/modalStore";
import { UiCheckBox } from "./ui/UiCheckBox";
import { UiButton } from "./ui/UiButton";
import { UiSelect } from "./ui/UiSelect";
import { UiInput } from "./ui/UiInput";
import { storeToRefs } from "pinia";
import UiIcon from "./ui/UiIcon.vue";
import { globalTranslate } from "@/utils/globalTranslate";

export const OrderCreate = defineComponent({
  name: "OrderCreate",
  components: { UiButton, UiCheckBox, UiIcon, UiInput, UiSelect },
  setup() {
    const isFlash = ref<boolean>(false);
    const IsClicked = ref<boolean>(false);
    const { products } = storeToRefs(useProductStore());
    const { sellers } = storeToRefs(useSellerStore());
    const newOrders = reactive<newOrdersT>({
      status: "",
      seller_id: undefined,
      orderItems: [],
    });
    const orderItems = ref<newOrdersItemT[]>([
      {
        product_id: 0,
        quantity: 0,
        price: 0,
      },
    ]);
    const createNewOrders = () => {
      isFlash.value = true;
      newOrders.orderItems = orderItems.value.filter(
        (item) => item.product_id !== 0 && item.quantity !== 0
      );
      if (newOrders.seller_id && newOrders.orderItems.length !== 0) {
        useOrdersStore().createOneOrders(newOrders);
        useModalStore().updateModal({ key: "show", value: false });
      }
      setTimeout(() => {
        isFlash.value = false;
      }, 1000);
    };
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
          class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center"
        >
          {globalTranslate("Orders.create.title")}
        </h1>
        <div class="h-full  w-full grid grid-cols-1 gap-2">
          <div class="w-full  h-full flex flex-col gap-1">
            <h1 class="font-medium">
              {globalTranslate("Orders.create.details.seller.title")}
            </h1>
            <UiSelect
              items={sellers.value.map((seller) => ({
                name: seller.name,
                id: seller.id,
              }))}
              onSelect={(id: number) => (newOrders.seller_id = id)}
              IsClickedOuside={IsClicked.value}
            >
              {globalTranslate("Orders.create.details.seller.select")}
            </UiSelect>
          </div>
          <div class="w-full  h-full flex flex-col gap-1">
            <h1 class="font-medium">
              {" "}
              {globalTranslate("Orders.create.details.order.title")}
            </h1>
            <div class="w-full  h-full flex flex-col mb-1 gap-1">
              <div class="flex justify-between w-full">
                <div class="h-full w-full flex flex-row flex-nowrap items-center gap-2">
                  <UiCheckBox
                    onCheck={(check) =>
                      check
                        ? (newOrders.status = "delivered")
                        : (newOrders.status = "")
                    }
                  />
                  <span>{globalTranslate("Orders.status.delivered")}</span>
                </div>
                <div class="h-full w-full flex flex-row flex-nowrap items-center justify-center gap-2">
                  <UiCheckBox
                    onCheck={(check) =>
                      check
                        ? (newOrders.status = "pending")
                        : (newOrders.status = "")
                    }
                  />
                  <span>{globalTranslate("Orders.status.pending")}</span>
                </div>
                <div class="h-full w-full flex flex-row justify-end flex-nowrap items-center gap-2">
                  <UiCheckBox
                    onCheck={(check) =>
                      check
                        ? (newOrders.status = "canceled")
                        : (newOrders.status = "")
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
                  orderItems.value.push({
                    product_id: 0,
                    quantity: 0,
                    price: 0,
                  })
                }
              >
                {globalTranslate("Orders.create.details.order.add")}
              </UiButton>
              <div class="w-full grid grid-cols-[1fr_1fr_1fr_36px] pb-10 overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1">
                <div class="flex flex-col gap-2">
                  {orderItems.value.map((item, index) => (
                    <UiSelect
                      items={products.value.map((product) => ({
                        name: product.name,
                        id: product.id,
                      }))}
                      onSelect={(id: number) => (item.product_id = id)}
                      IsClickedOuside={IsClicked.value}
                    >
                      {globalTranslate("Orders.create.details.order.select")}
                    </UiSelect>
                  ))}
                </div>
                <div class="flex flex-col gap-2">
                  {orderItems.value.map((item, index) => (
                    <div class="h-full w-full flex items-center relative">
                      <UiInput
                        class="border-r-0"
                        IsEmpty={isFlash.value && item.quantity == 0}
                        PlaceHolder={globalTranslate(
                          "Orders.create.details.order.placeholder[0]"
                        )}
                        Type="number"
                        OnInputChange={(value) =>
                          (item.quantity = Number(value))
                        }
                      >
                        {{
                          unite: () => (
                            <span class="h-full text-gray-400 rounded-md px-2 border-r-2  flex items-center justify-center">
                              Item
                            </span>
                          ),
                        }}
                      </UiInput>
                    </div>
                  ))}
                </div>
                <div class="flex flex-col gap-2">
                  {orderItems.value.map((item, index) => (
                    <div class="h-full w-full flex items-center relative">
                      <UiInput
                        class="border-r-0"
                        IsEmpty={isFlash.value && item.price == 0}
                        PlaceHolder={globalTranslate(
                          "Orders.create.details.order.placeholder[1]"
                        )}
                        Type="number"
                        OnInputChange={(value) => (item.price = Number(value))}
                      >
                        {{
                          unite: () => (
                            <span class="h-full text-gray-400 rounded-md px-2 border-r-2  flex items-center justify-center">
                              DH
                            </span>
                          ),
                        }}
                      </UiInput>
                    </div>
                  ))}
                </div>

                <div class="flex flex-col gap-2">
                  {orderItems.value.map((item, index) => (
                    <div
                      onClick={() => orderItems.value.splice(index, 1)}
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
          <UiButton colorTheme="a" Click={() => createNewOrders()}>
            {globalTranslate("Orders.create.button")}
          </UiButton>
        </div>
      </div>
    );
  },
});
