import { defineComponent, ref, Transition, type PropType } from "vue";

export const UiCheckBox = defineComponent({
  name: "UiCheckBox",
  props: {
    onCheck: {
      type: Function as PropType<(check: boolean) => void>,
      required: true,
    },
  },
  setup(props) {
    const checked = ref<boolean>(false);
    return () => (
      <div
        onClick={() => {
          checked.value = !checked.value;
          props.onCheck(checked.value);
        }}
        class={
          checked.value
            ? "w-4 h-4 border-2 cursor-pointer flex items-center justify-center relative transition-all transform duration-100 border-gray-400  rounded-sm bg-gray-300 text-white"
            : "w-4 h-4 flex rounded-sm border-gray-400 cursor-pointer rounded-ms border-2 transition-all transform duration-150"
        }
      >
        {checked.value ? (
          <Transition>
            <span class="text-white   text-[10px] absolute ">✔</span>
          </Transition>
        ) : (
          ""
        )}
      </div>
    );
  },
});
