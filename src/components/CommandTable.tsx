/*tslint:disable:no-string-literal*/
import { defineComponent, type PropType, ref } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { UiPagination } from "./ui/UiPagination";
import { UiCheckBox } from "./ui/UiCheckBox";
import type { commandT } from "@/types";
import UiIcon from "./ui/UiIcon.vue";
import { RouterLink } from "vue-router";
import { globalTranslate } from "@/utils/globalTranslate";

export const CommandTable = defineComponent({
  name: "CommandTable",
  props: {
    Commands: {
      type: Array as PropType<commandT[]>,
      required: true,
    },
    sortBy: {
      type: Function as PropType<(by: string) => void>,
    },
    FilterParam: {
      type: String,
      required: true,
      default: "",
    },
  },
  components: { UiCheckBox, UiIcon, UiPagination },
  setup(props) {
    const modalStore = useModalStore();

    const pagination = ref<number>(0);
    const checkedCommands = ref<number[]>([]);

    const checkThisCommand = (IsIncluded: boolean, id: number) => {
      IsIncluded
        ? checkedCommands.value.push(id)
        : checkedCommands.value.splice(checkedCommands.value.indexOf(id), 1);
    };

    const toggleThisCommand = (Command: commandT, name: string) => {
      modalStore.updateModal({ key: "show", value: true });
      modalStore.updateModal({ key: "name", value: name });
      modalStore.updateCommandRow(Command);
    };
    //

    return () => (
      <div class="flex flex-col w-full h-full">
        <table class="table-auto rounded-md overflow-hidden w-full">
          <thead class="text-xs h-9 rounded-md font-semibold uppercase text-[rgba(25,23,17,0.6)] bg-gray-300">
            <tr>
              <th></th>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <th class="p-2 w-fit ">
                  <div class="font-semibold text-left">
                    {globalTranslate(`Commands.index.feilds[${index}]`)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-gray-100">
            {props.Commands.filter((c) =>
              JSON.stringify(c).toLocaleLowerCase().includes(props.FilterParam)
            )
              .slice(pagination.value * 15, pagination.value * 15 + 15)
              .map((Command) => (
                <tr>
                  <td class="p-2">
                    <span class="h-full w-full grid">
                      <UiCheckBox
                        onCheck={(check) => checkThisCommand(check, Command.id)}
                      />
                    </span>
                  </td>
                  <td class="p-2">
                    <div class="font-medium text-gray-800">{Command.id}</div>
                  </td>
                  <td class="p-2">
                    <div class="text-left whitespace-nowrap overflow-ellipsis">
                      <RouterLink
                        to={{
                          name: "SellerDetails",
                          params: {
                            id: Command.seller_id,
                          },
                        }}
                      >
                        {Command.seller_id}
                      </RouterLink>
                    </div>
                  </td>
                  <td class="p-2">
                    <div class="text-left whitespace-nowrap overflow-ellipsis">
                      {Command.commandItems?.length ? (
                        <span>
                          {Command.commandItems?.length}{" "}
                          {Command.commandItems?.length == 1
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
                      {Command.status ? (
                        <span
                          class={`px-2 py-[1px] rounded-full ${
                            Command.status == "pending"
                              ? "bg-yellow-300/60 text-yellow-800"
                              : Command.status == "delivered"
                              ? "bg-green-300/60 text-green-800"
                              : "bg-red-300/60 text-red-800"
                          }`}
                        >
                          {globalTranslate(
                            `Commands.status.${Command.status.toLowerCase()}`
                          )}
                        </span>
                      ) : (
                        <span class="text-red-400">No status</span>
                      )}
                    </div>
                  </td>
                  <td class="p-2">
                    <div class="text-left whitespace-nowrap overflow-ellipsis">
                      {Command.created_at ?? (
                        <span class="text-red-400">No date</span>
                      )}
                    </div>
                  </td>
                  <td class="p-2">
                    <div class="flex  justify-start gap-3">
                      <UiIcon
                        onClick={() =>
                          toggleThisCommand(Command, "CommandDelete")
                        }
                        name={"delete"}
                      />
                      <UiIcon
                        onClick={() =>
                          toggleThisCommand(Command, "CommandUpdate")
                        }
                        name={"edit"}
                      />
                      <RouterLink
                        to={{
                          name: "CommandDetails",
                          params: { id: Command.id },
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
          <UiPagination
            goBack={() => pagination.value--}
            goForward={() => pagination.value++}
            itemsNumber={props.Commands.length}
            page={pagination.value}
          />
        </div>
      </div>
    );
  },
});
