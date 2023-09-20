import { defineComponent, ref, type PropType, watch } from "vue";

export const UiUpdateInput = defineComponent({
  name: "UiUpdateInput",
  props: {
    Type: {
      type: String,
      default: "text",
    },
    Disable: {
      type: Boolean,
      default: false,
    },
    Value: {
      type: [String, Number],
      required: true,
      default: "",
    },
    OnInputChange: {
      type: Function as PropType<(value: string | number) => void>,
      required: true,
    },
    PlaceHolder: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    const emitChange = ({ target }: { target: HTMLInputElement }) =>
      props.OnInputChange(target.value);
    return () => (
      <div
        class={`flex flex-nowrap h-full items-center border rounded-[4px] transition-all duration-200`}
      >
        <input
          class={"defaultInput border-none"}
          value={props.Value}
          disabled={props.Disable}
          onInput={(e) => emitChange(e as { target: any })}
          type={props.Type}
          placeholder={props.PlaceHolder}
        />
        {slots.unite?.()}
      </div>
    );
  },
});
