import { defineComponent, type PropType, ref } from "vue";
import { globalTranslate } from "@/utils/globalTranslate";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useModalStore } from "@/stores/modalStore";
import { UiPagination } from "./ui/UiPagination";
import { UiCheckBox } from "./ui/UiCheckBox";
import type { sellerT } from "@/types";
import UiIcon from "./ui/UiIcon.vue";
import { RouterLink } from "vue-router";

export const SellersTable = defineComponent({
  name: "SellersTable",
  props: {
    Sellers: {
      type: Array as PropType<sellerT[]>,
      required: true,
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
    const checkedSellers = ref<number[]>([]);
    const pagination = ref<number>(0);
    const checkThisUser = (IsInclude: boolean, id: number) => {
      IsInclude
        ? checkedSellers.value.push(id)
        : checkedSellers.value.splice(checkedSellers.value.indexOf(id), 1);
    };
    const toggleThisSeller = (Seller: sellerT, name: string) => {
      modalStore.updateSellerRow(Seller);
      modalStore.updateModal({ key: "name", value: name });
      modalStore.updateModal({ key: "show", value: true });
    };

    return () => (
      <div class="flex flex-col w-full">
        <table class="table-auto w-full">
          <thead class="text-xs h-9 font-semibold uppercase text-[rgba(25,23,17,0.6)] bg-gray-300">
            <tr class="">
              <th class="rounded-l-md"></th>
              <th class=""></th>
              {[0, 1, 2, 3, 4].map((index) => (
                <th class="p-2 w-fit last:rounded-r-md">
                  <div class="font-semibold text-left">
                    {globalTranslate(`Sellers.index.feilds[${index}]`)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-gray-100">
            {props.Sellers.filter((c) =>
              // @ts-ignore
              JSON.stringify(Object.values(c))
                .toLocaleLowerCase()
                .includes(props.FilterParam)
            )
              .slice(pagination.value * 17, pagination.value * 17 + 17)
              .map((Seller, index) => (
                <tr v-fade={index} key={Seller.id}>
                  <td class="p-2">
                    <span class="h-full w-full grid">
                      <UiCheckBox
                        onCheck={(check) => checkThisUser(check, Seller.id)}
                      />
                    </span>
                  </td>
                  <td class="p-2">
                    <div class="w-12 h-12 rounded-full overflow-hidden">
                      {Seller.image && Seller.image !== "" ? (
                        <img
                          class="rounded-full w-full h-full object-cover"
                          src={convertFileSrc(Seller.image)}
                        />
                      ) : (
                        <span class=" rounded-full w-full h-full object-fill animate-pulse bg-slate-300 duration-150" />
                      )}
                    </div>
                  </td>
                  <td class="p-2">
                    <div class="font-medium text-gray-800">{Seller.name}</div>
                  </td>
                  <td class="p-2">
                    <div class="text-left whitespace-nowrap overflow-ellipsis">
                      {Seller.email ?? (
                        <span class="text-red-400">No email</span>
                      )}
                    </div>
                  </td>
                  <td class="p-2">
                    <div class="text-left whitespace-nowrap overflow-ellipsis">
                      {Seller.phone ?? (
                        <span class="text-red-400">No phone</span>
                      )}
                    </div>
                  </td>
                  <td class="p-2">
                    <div class="text-left whitespace-nowrap overflow-ellipsis">
                      {Seller.address ?? (
                        <span class="text-red-400">No address</span>
                      )}
                    </div>
                  </td>
                  <td class="p-2">
                    <div class="flex  w-full justify-start gap-3">
                      <span
                        onClick={() => toggleThisSeller(Seller, "SellerDelete")}
                      >
                        <UiIcon name={"delete"} />
                      </span>
                      <span
                        onClick={() => toggleThisSeller(Seller, "SellerUpdate")}
                      >
                        <UiIcon name={"edit"} />
                      </span>
                      <RouterLink
                        to={{
                          name: "SellerDetails",
                          params: { id: Seller.id },
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
            itemsNumber={props.Sellers.length}
            page={pagination.value}
          />
        </div>
      </div>
    );
  },
});
