import { globalTranslate } from "@/utils/globalTranslate";
import { SellersTable } from "@/components/SellersTable";
import { UiButton } from "@/components/ui/UiButton";
import { UiInput } from "@/components/ui/UiInput";
import type { sellerT, withCount } from "@/types";
import UiIcon from "@/components/ui/UiIcon.vue";
import { store } from "@/store";
import { invoke } from "@tauri-apps/api";
import { useRouter } from "vue-router";
import {
  type WatchStopHandle,
  defineComponent,
  onBeforeMount,
  onUnmounted,
  onMounted,
  computed,
  Transition,
  provide,
  watch,
  ref,
} from "vue";

export const SellersView = defineComponent({
  name: "Sellers",
  components: { SellersTable, UiButton, UiInput, UiIcon },
  setup() {
    const router = useRouter();
    //
    const sellers = ref<sellerT[]>([]);
    const searchQuery = ref<string>("");
    const totalRows = ref<number>(0);

    //
    const page = computed(() => Number(router.currentRoute.value.query.page));
    const refresh = computed(() => router.currentRoute.value.query.refresh);
    //
    let unwatch: WatchStopHandle | null = null;
    //
    provide("count", totalRows);

    //

    onBeforeMount(() => getSellers(page.value));
    //
    onMounted(() => {
      unwatch = watch([page, refresh], ([p]) => {
        if (p && p > 0) getSellers(p);
      });
    });
    //
    onUnmounted(() => {
      if (unwatch) unwatch();
    });
    //
    async function getSellers(page: number = 1) {
      try {
        const res = await invoke<withCount<sellerT[]>>("get_sellers", {
          page,
        });
        if (res.data.length) {
          sellers.value = res.data;
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
                  Click={() => updateModal("SellerCreate")}
                >
                  <UiIcon
                    class=" fill-gray-900 cursor-default hover:bg-transparent"
                    name="add"
                  />{" "}
                  {globalTranslate("Sellers.index.addButton")}
                </UiButton>
              </div>
            </div>
          </Transition>
          <Transition appear>
            <SellersTable Sellers={sellers.value} />
          </Transition>
        </div>
      </main>
    );
  },
});
