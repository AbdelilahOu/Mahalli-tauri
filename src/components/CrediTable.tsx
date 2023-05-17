import { defineComponent, ref, type PropType } from "vue";
import { UiPagination } from "./ui/UiPagination";
import { formatDate } from "@/utils/formatDate";
import { globalTranslate } from "@/utils/globalTranslate";
import type { crediT } from "@/types";
import UiIcon from "./ui/UiIcon.vue";
import { useModalStore } from "@/stores/modalStore";
export const CrediTable = defineComponent({
  name: "CrediTable",
  props: {
    Credi: {
      type: Array as PropType<crediT[]>,
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
  components: { UiPagination, UiIcon },
  setup(props) {
    const pagination = ref<number>(0);
    const toggleThisCredi = (credi: crediT, name: string) => {
      useModalStore().updateModal({ key: "show", value: true });
      useModalStore().updateModal({ key: "name", value: name });
      useModalStore().updateCrediRow(credi);
    };
    return () => (
      <div class="flex flex-col w-full h-fit">
        <table class="table-auto  w-full">
          <thead class="text-xs h-9  font-semibold uppercase text-[rgba(25,23,17,0.6)] bg-gray-300">
            <tr>
              <th class="rounded-l-md"></th>
              {[1, 2, 3, 4, 5].map((index) => (
                <th class="p-2 last:rounded-r-md">
                  <div class="font-semibold text-left">
                    {globalTranslate(`Credis.index.feilds[${index}]`)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-gray-100">
            {props.Credi.filter((c) =>
              JSON.stringify(c).toLocaleLowerCase().includes(props.FilterParam)
            )
              .slice(pagination.value * 15, pagination.value * 15 + 15)
              .map((credi, index) => (
                <tr v-fade={index} key={credi.id}>
                  <td class="p-2">
                    <div class="font-medium text-gray-800">{credi.id}</div>
                  </td>

                  <td class="p-2">
                    <div class="text-left font-medium">{credi.client.name}</div>
                  </td>
                  <td class="p-2">
                    <div class="text-left font-medium">{credi.clientId}</div>
                  </td>
                  <td class="p-2">
                    <div class="text-left">
                      {Math.abs(credi.price).toFixed(2)} DH
                    </div>
                  </td>
                  <td class="p-2">
                    <div class="text-left">{formatDate(credi.createdAt)}</div>
                  </td>
                  <td class="p-2">
                    <div
                      onClick={() => toggleThisCredi(credi, "CrediDelete")}
                      class="flex  justify-start gap-3"
                    >
                      <UiIcon name={"delete"} />
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
            itemsNumber={props.Credi.length}
            page={pagination.value}
          />
        </div>
      </div>
    );
  },
});
