import { convertFileSrc } from "@tauri-apps/api/tauri";
import { defineComponent, type PropType } from "vue";
import UiIcon from "@/components/ui/UiIcon.vue";

export const UiCard = defineComponent({
  name: "UiCard",
  props: {
    title: {
      type: String,
    },
    item: {
      type: Object as PropType<any | null>,
    },
    updateItem: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },

  setup(props) {
    return () => (
      // <UiIcon  name={"person"} />
      <div class="w-full flex xl:sticky shadow-md xl:top-[54px] z-20 pb-1 rounded-md gap-2 flex-col">
        <div class="text-2xl font-sans py-1 flex items-center font-medium">
          {props.item?.image ? (
            <img
              class=" rounded-full w-20 h-20 m-2 object-fill"
              src={convertFileSrc(props.item.image)}
            />
          ) : (
            <span class=" rounded-full w-20 h-20 m-2 object-fill animate-pulse bg-slate-300 duration-150" />
          )}
          <h1 class="flex whitespace-nowrap overflow-ellipsis">
            <span class="h-full flex items-center justify-center pt-1">
              <UiIcon name={"tag"} />
            </span>
            <span class="flex whitespace-nowrap">
              {props.item?.id} - {props.item?.name}
            </span>
          </h1>
        </div>
        <div class="w-full h-fit px-2">
          <div class="w-full flex justify-between  border-b-2 pb-1 border-gray-500">
            <h1 class="text-xl px-1 font-semibold font-sans">{props.title} </h1>
            <span onClick={() => props.updateItem()}>
              <UiIcon name={"edit_2"} />
            </span>
          </div>
        </div>
        <div class="w-full h-full px-2">
          <div class="flex fill-gray-700  gap-2 items-center">
            <UiIcon name={"email"} />
            <span class="">{props.item?.email}</span>
          </div>
          <div class="flex fill-gray-700  gap-2 items-center">
            <UiIcon name={"phone"} />
            <span class="">{props.item?.phone}</span>
          </div>
          <div class="flex fill-gray-700  gap-2 items-center">
            <UiIcon name={"location"} />
            <span class="">{props.item?.address}</span>
          </div>
        </div>
      </div>
    );
  },
});
