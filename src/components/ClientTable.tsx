import { defineComponent, type PropType, ref } from "vue";
import { globalTranslate } from "@/utils/globalTranslate";
import { useModalStore } from "@/stores/modalStore";
import { UiPagination } from "./ui/UiPagination";
import { UiCheckBox } from "./ui/UiCheckBox";
import { RouterLink } from "vue-router";
import type { clientT } from "@/types";
import UiIcon from "./ui/UiIcon.vue";

export const ClientTable = defineComponent({
  name: "ClientTable",
  props: {
    Clients: {
      type: Array as PropType<clientT[]>,
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
    const checkedClients = ref<number[]>([]);
    const pagination = ref<number>(0);
    const checkThisUser = (IsInclude: boolean, id: number) => {
      IsInclude
        ? checkedClients.value.push(id)
        : checkedClients.value.splice(checkedClients.value.indexOf(id), 1);
    };
    const toggleThisClient = (client: clientT, name: string) => {
      modalStore.updateModal({ key: "show", value: true });
      modalStore.updateModal({ key: "name", value: name });
      modalStore.updateClientRow(client);
    };
    return () => (
      <div class="flex flex-col w-full">
        <table class=" rounded-md overflow-hidden w-full">
          <thead class="text-xs h-9 max-w-lg w-fit rounded-md font-semibold uppercase text-[rgba(25,23,17,0.6)] bg-gray-300">
            <tr>
              <th></th>
              {[0, 1, 2, 3, 4].map((index) => (
                <th class="p-2 w-fit ">
                  <div class="font-semibold text-left">
                    {globalTranslate(`Clients.index.feilds[${index}]`)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-gray-100">
            {props.Clients.filter((c) =>
              JSON.stringify(c).toLocaleLowerCase().includes(props.FilterParam)
            )
              .slice(pagination.value * 15, pagination.value * 15 + 15)
              .map((client, index) => (
                <tr
                  v-motion
                  initial={{
                    opacity: 0,
                    // x: 100,
                  }}
                  enter={{
                    opacity: 1,
                    // x: 0,
                    transition: {
                      delay: (index + 1) * 100,
                    },
                  }}
                >
                  <td class="p-2">
                    <span class="h-full w-full grid">
                      <UiCheckBox
                        onCheck={(check) => checkThisUser(check, client.id)}
                      />
                    </span>
                  </td>
                  <td class="p-2">
                    <div class="font-medium text-gray-800">{client.name}</div>
                  </td>
                  <td class="p-2">
                    <div class="text-left whitespace-nowrap overflow-ellipsis">
                      {client.email ?? (
                        <span class="text-red-400">No email</span>
                      )}
                    </div>
                  </td>
                  <td class="p-2">
                    <div class="text-left whitespace-nowrap overflow-ellipsis">
                      {client.phone ?? (
                        <span class="text-red-400">No phone</span>
                      )}
                    </div>
                  </td>
                  <td class="p-2">
                    <div class="text-left whitespace-nowrap overflow-ellipsis">
                      {client.addresse ?? (
                        <span class="text-red-400">No address</span>
                      )}
                    </div>
                  </td>
                  <td class="p-2">
                    <div class="flex  justify-start gap-3">
                      <UiIcon
                        onClick={() => toggleThisClient(client, "ClientDelete")}
                        name={"delete"}
                      />
                      <UiIcon
                        onClick={() => toggleThisClient(client, "ClientUpdate")}
                        name={"edit"}
                      />
                      <RouterLink
                        to={{
                          name: "ClientDetails",
                          params: { id: client.id },
                        }}
                      >
                        <UiIcon name={"more"} />
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
            itemsNumber={props.Clients.length}
            page={pagination.value}
          />
        </div>
      </div>
    );
  },
});
