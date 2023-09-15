import { InvoicesTable } from "@/components/InvoicesTable";
import { globalTranslate } from "@/utils/globalTranslate";
import { UiButton } from "@/components/ui/UiButton";
import type { invoiceT, withCount } from "@/types";
import { UiInput } from "@/components/ui/UiInput";
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
  provide,
  watch,
  ref,
} from "vue";

export const InvoicesView = defineComponent({
  name: "Invoices",
  components: {
    InvoicesTable,
    UiButton,
    UiInput,
    UiIcon,
  },
  setup() {
    //

    const router = useRouter();

    const invoices = ref<invoiceT[]>([]);
    const searchQuery = ref<string>("");
    const page = computed(() => Number(router.currentRoute.value.query.page));
    const refresh = computed(() => router.currentRoute.value.query.refresh);

    const totalRows = ref<number>(0);

    let unwatch: WatchStopHandle | null = null;
    //
    provide("count", totalRows);

    onBeforeMount(() => getInvoices(page.value));

    onMounted(() => {
      unwatch = watch([page, refresh], ([p]) => {
        if (p && p > 0) getInvoices(p);
      });
    });

    onUnmounted(() => {
      if (unwatch) unwatch();
    });

    async function getInvoices(page: number = 1) {
      try {
        const res = await invoke<withCount<invoiceT[]>>("get_invoices", {
          page,
        });
        if (res.data.length) {
          invoices.value = res.data;
          totalRows.value = res.count;
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
                  Click={() => updateModal("InvoiceCreate")}
                >
                  <UiIcon
                    class=" fill-gray-900 cursor-default hover:bg-transparent"
                    name="add"
                  />{" "}
                  {globalTranslate("Invoices.index.addButton")}
                </UiButton>
              </div>
            </div>
          </Transition>
          <Transition appear>
            <InvoicesTable Invoices={invoices.value} />
          </Transition>
        </div>
      </main>
    );
  },
});
