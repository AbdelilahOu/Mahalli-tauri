import { globalTranslate } from "@/utils/globalTranslate";
import { useCommandStore } from "@/stores/commandStore";
import { useProductStore } from "@/stores/productStore";
import { useSellerStore } from "@/stores/sellerStore";
import { UiUpdateSelect } from "./ui/UiUpdateSelect";
import { useModalStore } from "@/stores/modalStore";
import { UiUpdateInput } from "./ui/UiUpdateInput";
import type { updateCommandT } from "@/types";
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

export const CommandUpdate = defineComponent({
  name: "CommandUpdate",
  components: { UiButton, UiUpdateInput, UiIcon, UiUpdateSelect, UiCheckBox },
  setup() {
    //
    const productStore = useProductStore();
    const sellerStore = useSellerStore();
    const modalStore = useModalStore();
    //
    const { command: CommandRow } = storeToRefs(modalStore);

    const { products } = storeToRefs(productStore);
    const { sellers } = storeToRefs(sellerStore);
    const IsClicked = ref<boolean>(false);
    //
    const Command: updateCommandT = {
      id: undefined,
      status: undefined,
      seller_id: undefined,
      commandItems: [],
    };
    //
    const updateCommand = reactive<updateCommandT>(
      CommandRow.value ? CommandRow.value : Command
    );
    //
    const updateTheCommand = () => {
      if (updateCommand.id) {
        useCommandStore().updateOneCommand(updateCommand.id, updateCommand);
        modalStore.updateModal({ key: "show", value: false });
      }
    };
    onBeforeUnmount(() => modalStore.updateCommandRow(null));

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
          {globalTranslate("Commands.update.title")} N° {updateCommand.id}
        </h1>
        <div class="h-full  w-full grid grid-cols-1 gap-2">
          <div class="w-full  h-full flex flex-col gap-1">
            <h1 class="font-medium">
              {globalTranslate("Commands.update.details.seller.title")}
            </h1>
            <UiUpdateSelect
              Value={
                sellers.value.find((cli) => updateCommand.seller_id === cli.id)
                  ?.name ?? ""
              }
              items={sellers.value.map((seller) => ({
                name: seller.name,
                id: seller.id,
              }))}
              onSelect={(id: number) => (updateCommand.seller_id = id)}
              IsClickedOuside={IsClicked.value}
            >
              {globalTranslate("Commands.update.details.seller.select")}
            </UiUpdateSelect>
          </div>
          <div class="w-full  h-full flex flex-col gap-1">
            <h1 class="font-medium">
              {globalTranslate("Commands.update.details.command.title")}
            </h1>
            <div class="w-full  h-full flex flex-col mb-1 gap-1">
              <div class="flex justify-between w-full">
                <div class="h-full w-full flex flex-row flex-nowrap items-center gap-2">
                  <UiCheckBox
                    onCheck={(check) =>
                      check
                        ? (updateCommand.status = "delivered")
                        : (updateCommand.status = "")
                    }
                  />
                  <span>{globalTranslate("Commands.status.delivered")}</span>
                </div>
                <div class="h-full w-full flex flex-row flex-nowrap items-center justify-center gap-2">
                  <UiCheckBox
                    onCheck={(check) =>
                      check
                        ? (updateCommand.status = "pending")
                        : (updateCommand.status = "")
                    }
                  />
                  <span>{globalTranslate("Commands.status.pending")}</span>
                </div>
                <div class="h-full w-full flex flex-row justify-end flex-nowrap items-center gap-2">
                  <UiCheckBox
                    onCheck={(check) =>
                      check
                        ? (updateCommand.status = "canceled")
                        : (updateCommand.status = "")
                    }
                  />
                  <span>{globalTranslate("Commands.status.canceled")}</span>
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
                onClick={() =>
                  updateCommand.commandItems?.push({
                    product_id: 0,
                    quantity: 0,
                  })
                }
              >
                {globalTranslate("Commands.update.details.command.add")}
              </UiButton>
              <div class="w-full grid grid-cols-[1fr_1fr_1fr_36px] pb-10 overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1">
                <div class="flex flex-col gap-2">
                  {updateCommand.commandItems?.map((item, index) => (
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
                      {globalTranslate(
                        "Commands.update.details.command.select"
                      )}
                    </UiUpdateSelect>
                  ))}
                </div>
                <div class="flex flex-col gap-2">
                  {updateCommand.commandItems?.map((item, index) => (
                    <div class="h-full flex w-full items-center relative">
                      <UiUpdateInput
                        class="border-r-0"
                        Value={item.quantity}
                        PlaceHolder={globalTranslate(
                          "Commands.create.details.command.placeholder[0]"
                        )}
                        Type="number"
                        OnInputChange={(value) =>
                          (item.quantity = Number(value))
                        }
                      />
                      <span class="h-full text-gray-400 px-2 border-2 border-l-0 flex items-center justify-center">
                        Item
                      </span>
                    </div>
                  ))}
                </div>
                <div class="flex flex-col gap-2">
                  {updateCommand.commandItems?.map((item, index) => (
                    <div class="h-full flex w-full items-center relative">
                      <UiUpdateInput
                        class="border-r-0 "
                        Value={item.price}
                        PlaceHolder={globalTranslate(
                          "Commands.create.details.command.placeholder[1]"
                        )}
                        Type="number"
                        OnInputChange={(value) => (item.price = Number(value))}
                      />
                      <span class="h-full text-gray-400 px-2 border-2 border-l-0 flex items-center justify-center">
                        DH
                      </span>
                    </div>
                  ))}
                </div>
                <div class="flex flex-col gap-2">
                  {updateCommand.commandItems?.map((item, index) => (
                    <div class="flex justify-center bg-gray-100 hover:bg-gray-300 transition-all duration-200  rounded-md items-center w-full h-full">
                      <UiIcon
                        onClick={() => {
                          updateCommand.commandItems?.splice(index, 1);
                          if (item.id)
                            useCommandStore().deleteOneCommandItem(item.id);
                        }}
                        name="delete"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex">
          <UiButton colorTheme="a" onClick={() => updateTheCommand()}>
            {globalTranslate("Commands.update.button")}
          </UiButton>
        </div>
      </div>
    );
  },
});
