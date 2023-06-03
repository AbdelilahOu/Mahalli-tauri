import { defineComponent } from "vue";

export const ChartHolder = defineComponent({
  name: "ChartHolder",
  props: {
    title: String,
  },
  setup({ title }, { slots }) {
    return () => (
      <div
        class={`${
          title ? "grid-rows-[50px_1fr]" : "grid-rows-1"
        } w-full h-full grid overflow-hidden gap-1 grid-cols-1  rounded-md shadow-md`}
      >
        {title && (
          <div class="w-full h-full flex items-center bg-slate-100">
            <h1 class="m-2 w-full text-center">{title}</h1>
          </div>
        )}
        <div class="w-full h-full p-2 flex">
          {slots.default && slots.default()}
        </div>
      </div>
    );
  },
});
