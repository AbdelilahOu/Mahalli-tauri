import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { defineComponent, onBeforeMount, reactive, ref } from "vue";
import type { newOrdersT, newOrdersItemT } from "@/types";
import { globalTranslate } from "@/utils/globalTranslate";
import { UiCheckBox } from "./ui/UiCheckBox";
import { UiButton } from "./ui/UiButton";
import { invoke } from "@tauri-apps/api";
import { UiSelect } from "./ui/UiSelect";
import { UiInput } from "./ui/UiInput";
import UiIcon from "./ui/UiIcon.vue";
import { store } from "@/store";

export const OrderCreate = defineComponent({
  name: "OrderCreate",
  components: { UiButton, UiCheckBox, UiIcon, UiInput, UiSelect },
  setup() {
    const { updateQueryParams } = useUpdateRouteQueryParams();

    const isFlash = ref<boolean>(false);

    const sellers = ref<{ name: string; id: number }[]>([]);
    const products = ref<{ name: string; id: number }[]>([]);

    const newOrder = reactive<newOrdersT>({
      status: "",
      seller_id: undefined,
      order_items: [],
    });

    const order_items = ref<newOrdersItemT[]>([
      {
        product_id: 0,
        quantity: 0,
        price: 0,
      },
    ]);

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
    //

    const createNewOrders = async () => {
      isFlash.value = true;
      newOrder.order_items = order_items.value.filter(
        (item) => item.product_id !== 0 && item.quantity !== 0
      );
      if (newOrder.seller_id && newOrder.order_items.length !== 0) {
        try {
          await invoke("insert_order", {
            order: newOrder,
          });
          // toggle refresh
          updateQueryParams({
            refresh: "refresh-create-" + Math.random() * 9999,
          });
        } catch (error) {
          console.log(error);
        } finally {
          store.setters.updateStore({ key: "show", value: false });
        }
      }
      setTimeout(() => {
        isFlash.value = false;
      }, 1000);
    };
    return () => (
      <div class="w-5/6 lg:w-1/2 rounded-[4px] relative h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Orders.create.title")}
        </h1>
        <div class="h-full  w-full grid grid-cols-1 gap-2">
          <div class="w-full  h-full flex flex-col gap-1">
            <h1 class="font-medium">
              {globalTranslate("Orders.create.details.seller.title")}
            </h1>
            <UiSelect
              items={sellers.value}
              onSelect={(id: number) => (newOrder.seller_id = id)}
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
                        ? (newOrder.status = "delivered")
                        : (newOrder.status = "")
                    }
                  />
                  <span>{globalTranslate("Orders.status.delivered")}</span>
                </div>
                <div class="h-full w-full flex flex-row flex-nowrap items-center justify-center gap-2">
                  <UiCheckBox
                    onCheck={(check) =>
                      check
                        ? (newOrder.status = "pending")
                        : (newOrder.status = "")
                    }
                  />
                  <span>{globalTranslate("Orders.status.pending")}</span>
                </div>
                <div class="h-full w-full flex flex-row justify-end flex-nowrap items-center gap-2">
                  <UiCheckBox
                    onCheck={(check) =>
                      check
                        ? (newOrder.status = "canceled")
                        : (newOrder.status = "")
                    }
                  />
                  <span>{globalTranslate("Orders.status.canceled")}</span>
                </div>
              </div>
            </div>
            <div class="w-full  h-full flex flex-col gap-1">
              <UiButton
                Click={() =>
                  order_items.value.push({
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
                  {order_items.value.map((item, index) => (
                    <UiSelect
                      items={products.value}
                      onSelect={(id: number) => (item.product_id = id)}
                    >
                      {globalTranslate("Orders.create.details.order.select")}
                    </UiSelect>
                  ))}
                </div>
                <div class="flex flex-col gap-2">
                  {order_items.value.map((item, index) => (
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
                            <span class="h-full text-gray-400 rounded-[4px] px-2 border-r-2  flex items-center justify-center">
                              Item
                            </span>
                          ),
                        }}
                      </UiInput>
                    </div>
                  ))}
                </div>
                <div class="flex flex-col gap-2">
                  {order_items.value.map((item, index) => (
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
                            <span class="h-full text-gray-400 rounded-[4px] px-2 border-r-2  flex items-center justify-center">
                              DH
                            </span>
                          ),
                        }}
                      </UiInput>
                    </div>
                  ))}
                </div>

                <div class="flex flex-col gap-2">
                  {order_items.value.map((item, index) => (
                    <div
                      onClick={() => order_items.value.splice(index, 1)}
                      class="flex justify-center bg-gray-100 hover:bg-gray-300 transition-all duration-200  rounded-[4px] items-center w-full h-full"
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
