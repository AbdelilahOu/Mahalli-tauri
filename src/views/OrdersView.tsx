import { globalTranslate } from "@/utils/globalTranslate";
import { OrdersTable } from "@/components/OrdersTable";
import { UiButton } from "@/components/ui/UiButton";
import { UiInput } from "@/components/ui/UiInput";
import type { orderT, withCount } from "@/types";
import UiIcon from "@/components/ui/UiIcon.vue";
import { store } from "@/store";
import { invoke } from "@tauri-apps/api";
import { useRouter } from "vue-router";
import {
  type WatchStopHandle,
  defineComponent,
  onBeforeMount,
  onUnmounted,
  Transition,
  onMounted,
  computed,
  watch,
  ref,
  provide,
} from "vue";

export const OrdersView = defineComponent({
  name: "Orders",
  components: {
    OrdersTable,
    UiButton,
    UiInput,
    UiIcon,
  },
  setup() {
    const router = useRouter();

    const orders = ref<orderT[]>([]);
    const searchQuery = ref<string>("");
    const page = computed(() => Number(router.currentRoute.value.query.page));
    const refresh = computed(() => router.currentRoute.value.query.refresh);
    const totalRows = ref<number>(0);

    let unwatch: WatchStopHandle | null = null;
    //

    provide("count", totalRows);

    onBeforeMount(() => getOrders(page.value));

    onMounted(() => {
      unwatch = watch([page, refresh], ([p]) => {
        if (p && p > 0) getOrders(p);
      });
    });

    onUnmounted(() => {
      if (unwatch) unwatch();
    });

    async function getOrders(page: number = 1) {
      try {
        const res = await invoke<withCount<orderT[]>>("get_orders", {
          page,
        });
        if (res.data.length) {
          orders.value = res.data;
          totalRows.value = res.count;
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }

    //
    const updateModal = (name: string) => {
      store.setters.updateStore({ key: "show", value: true });
      store.setters.updateStore({ key: "name", value: name });
    };
    //

    return () => (
      <main class="w-full h-full">
        <div class="w-full h-full flex flex-col items-start justify-start">
          <Transition appear>
            <div class="flex justify-between w-full gap-9 mb-1">
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
                  Click={() => updateModal("OrderCreate")}
                >
                  <UiIcon
                    class=" fill-gray-900 cursor-default hover:bg-transparent"
                    name="add"
                  />{" "}
                  {globalTranslate("Orders.index.addButton")}
                </UiButton>
              </div>
            </div>
          </Transition>
          <Transition appear>
            <OrdersTable Orders={orders.value} />
          </Transition>
        </div>
      </main>
    );
  },
});
