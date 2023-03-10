import { defineComponent, type PropType } from "vue";
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
    return () => (
      // <UiIcon IsStyled={true} name={"person"} />
      <div class="w-full flex xl:sticky xl:top-[50px] z-20 pb-1 rounded-md gap-2 border-[1px] border-gray-501 flex-col bg-gray-100">
        <div class="text-3xl  font-sans py-1 flex items-center  font-medium">
          <span class="h-full flex items-center justify-center pt-1">
            <UiIcon IsStyled={true} name={"tag"} />
          </span>
          {props.client?.id} - {props.client?.name}
        </div>
        <div class="w-full h-fit px-2">
          <div class="w-full flex justify-between  border-b-2 pb-1 border-gray-500">
            <h1 class="text-xl px-1 font-semibold font-sans">Client Details</h1>
            <UiIcon onClick={() => props.updateClient()} name={"edit_2"} />
          </div>
        </div>
        <div class="w-full h-full px-2">
          <div class="flex fill-gray-700 justify-between  gap-2 items-center">
            <UiIcon IsStyled={true} name={"email"} />
            <span class="">{props.client?.email}</span>
          </div>
          <div class="flex fill-gray-700 justify-between  gap-2 items-center">
            <UiIcon IsStyled={true} name={"phone"} />
            <span class="">{props.client?.phone}</span>
          </div>
          <div class="flex fill-gray-700 justify-between  gap-2 items-center">
            <UiIcon IsStyled={true} name={"location"} />
            <span class="">{props.client?.addresse}</span>
          </div>
        </div>
      </div>
    );
  },
});
