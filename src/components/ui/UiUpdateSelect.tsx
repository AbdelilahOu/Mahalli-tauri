import {
  defineComponent,
  onUnmounted,
  ref,
  Transition,
  watch,
  type PropType,
} from "vue";

export const UiUpdateSelect = defineComponent({
  name: "UiUpdateSelect",
  props: {
    items: {
      type: Array as PropType<{ name: string; id: number }[]>,
      required: true,
    },
    onSelect: {
      type: Function as PropType<(id: number) => void>,
      required: true,
    },
    IsClickedOuside: {
      type: Boolean,
      required: true,
    },
    Value: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    const isOpen = ref<boolean>(false);
    const selectedItem = ref<string>(props.Value);

    const selectAnItem = ({ name, id }: { name: string; id: number }) => {
      isOpen.value = false;
      selectedItem.value = name;
      props.onSelect(id);
    };

    const unWatch = watch(
      () => props.IsClickedOuside,
      () => {
        isOpen.value = false;
      }
    );
    onUnmounted(() => unWatch());
    return () => (
      <div class="relative h-fit">
        <div
          class="h-9 z-10 px-4 py-2 font-semibold w-full disabled:cursor-default disabled:hover:bg-gray-50 disabled:hover:border-gray-200 hover:bg-gray-300  hover:border-gray-300 hover:text-black text-gray-600 transition-all duration-200 flex items-center whitespace-nowrap justify-center text-center bg-gray-50 rounded-sm border"
          onClick={() => (isOpen.value = !isOpen.value)}
        >
          {selectedItem.value !== "" ? selectedItem.value : slots.default?.()}
        </div>
        {isOpen.value ? (
          <Transition appear>
            <div class="flex rounded-sm scrollbar-thin bg-white scrollbar-thumb-transparent flex-col max-h-[105px] overflow-auto gap-[2px] w-full absolute z-50  mt-1">
              {props.items.map((item) => (
                <div
                  class="px-2 z-50 py-1 last:mb-1 hover:bg-gray-300 bg-gray-200"
                  onClick={() => selectAnItem(item)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </Transition>
        ) : (
          ""
        )}
      </div>
    );
  },
});
