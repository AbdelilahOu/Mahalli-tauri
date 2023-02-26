import { defineComponent, type PropType } from "vue";
import UiIcon from "@/components/ui/UiIcon.vue";
import type { clientT } from "@/types";

export const ClientCard = defineComponent({
  name: "ClientCard",
  props: {
    client: {
      type: Object as PropType<clientT | null>,
    },
  },
  setup(props, ctx) {
    return () => (
      <div class="w-full grid grid-cols-2 grid-rows-1 rounded-sm">
        <span class="flex fill-gray-400 gap-2 items-center">
          <UiIcon IsStyled={true} name={"person"} /> {props.client?.name}
        </span>
        <span class="flex fill-gray-400 gap-2 items-center">
          <UiIcon IsStyled={true} name={"tag"} />
          {props.client?.id}
        </span>
        <span class="flex fill-gray-400 gap-2 items-center">
          <UiIcon IsStyled={true} name={"email"} />
          {props.client?.email}
        </span>
        <span class="flex fill-gray-400 gap-2 items-center">
          <UiIcon IsStyled={true} name={"location"} />
          {props.client?.addresse}
        </span>
        <span class="flex fill-gray-400 gap-2 items-center">
          <UiIcon IsStyled={true} name={"phone"} />
          {props.client?.phone}
        </span>
      </div>
    );
  },
});
