import { defineComponent, onBeforeMount, ref, Transition } from "vue";
import { globalTranslate } from "@/utils/globalTranslate";
import { InvoicesTable } from "@/components/InvoicesTable";
import { UiButton } from "@/components/ui/UiButton";
import { useModalStore } from "@/stores/modalStore";
import { UiInput } from "@/components/ui/UiInput";
import UiIcon from "@/components/ui/UiIcon.vue";
import type { invoiceT } from "@/types";
import { invoke } from "@tauri-apps/api";

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
    const modalStore = useModalStore();
    const invoices = ref<invoiceT[]>([]);
    const searchQuery = ref<string>("");
    //
    onBeforeMount(async () => {
      try {
        const res = await invoke<invoiceT[]>("get_invoices", { page: 1 });
        if (res) {
          invoices.value = res;
          return;
        }
      } catch (error) {
        console.log(error);
      }
    });
    //
    const updateModal = (name: string) => {
      modalStore.updateModal({ key: "show", value: true });
      modalStore.updateModal({ key: "name", value: name });
    };
    //

    return () => (
      <main class="w-full h-full px-3">
        <div class="w-full h-full flex flex-col items-start justify-start">
          <Transition appear>
            <div class="flex justify-between w-full gap-9 my-1">
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
            <InvoicesTable
              FilterParam={searchQuery.value}
              Invoices={invoices.value}
            />
          </Transition>
        </div>
      </main>
    );
  },
});
