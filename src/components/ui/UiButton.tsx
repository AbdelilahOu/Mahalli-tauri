import { defineComponent, type PropType } from "vue";

export const UiButton = defineComponent({
  name: "UiButton",
  props: {
    colorTheme: {
      type: String,
      required: false,
      default: "primary",
    },
    Disable: {
      type: Boolean,
      default: false,
    },
    Click: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  setup(props, { slots }) {
    return () => (
      <button
        onClick={() => props.Click()}
        disabled={props.Disable}
        class={`defaultButton disabled:hover:border-sky-200 hover:bg-sky-300/40 hover:border-sky-300 hover:text-black ${
          props.colorTheme == "primary"
            ? " disabled:hover:bg-sky-50 text-sky-600 bg-sky-50"
            : " disabled:hover:bg-sky-500 text-black bg-sky-400"
        }`}
      >
        <div class="flex items-center w-full h-full justify-center">
          {slots.default?.()}
        </div>
      </button>
    );
  },
});
