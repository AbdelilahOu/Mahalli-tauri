import { convertFileSrc } from "@tauri-apps/api/tauri";
import { join, appDataDir } from "@tauri-apps/api/path";
import { ref, defineComponent, onMounted, type PropType } from "vue";
import UiIcon from "@/components/ui/UiIcon.vue";
import type { clientT } from "@/types";

export const ClientCard = defineComponent({
  name: "ClientCard",
  props: {
    client: {
      type: Object as PropType<clientT | null>,
    },
    updateClient: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },

  setup(props) {
    const clientImage = ref("");

    onMounted(async () => {
      if (props.client?.image)
        clientImage.value = convertFileSrc(
          await join(await appDataDir(), "Images", props.client.image)
        );
    });
    return () => (
      // <UiIcon  name={"person"} />
      <div class="w-full flex xl:sticky shadow-md xl:top-[54px] z-20 pb-1 rounded-md gap-2 flex-col">
        <div class="text-2xl font-sans py-1 flex items-center font-medium">
          {props.client?.image ? (
            <img
              class=" rounded-full w-20 h-20 m-2 object-fill"
              src={clientImage.value}
            />
          ) : (
            ""
          )}
          <h1 class="flex whitespace-nowrap overflow-ellipsis">
            <span class="h-full flex items-center justify-center pt-1">
              <UiIcon name={"tag"} />
            </span>
            {props.client?.id} - {props.client?.name}
          </h1>
        </div>
        <div class="w-full h-fit px-2">
          <div class="w-full flex justify-between  border-b-2 pb-1 border-gray-500">
            <h1 class="text-xl px-1 font-semibold font-sans">Client Details</h1>
            <span onClick={() => props.updateClient()}>
              <UiIcon name={"edit_2"} />
            </span>
          </div>
        </div>
        <div class="w-full h-full px-2">
          <div class="flex fill-gray-700  gap-2 items-center">
            <UiIcon name={"email"} />
            <span class="">{props.client?.email}</span>
          </div>
          <div class="flex fill-gray-700  gap-2 items-center">
            <UiIcon name={"phone"} />
            <span class="">{props.client?.phone}</span>
          </div>
          <div class="flex fill-gray-700  gap-2 items-center">
            <UiIcon name={"location"} />
            <span class="">{props.client?.addresse}</span>
          </div>
        </div>
      </div>
    );
  },
});
