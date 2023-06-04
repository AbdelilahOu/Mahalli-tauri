import { defineComponent } from "vue";

export const ChartHolder = defineComponent({
  name: "ChartHolder",
  setup({}, { slots }) {
    return () => (
      <div
        class={`${
          slots.title ? "grid-rows-[50px_1fr]" : "grid-rows-1"
        } w-full h-fit grid overflow-hidden gap-1 grid-cols-1  rounded-md shadow-md`}
      >
        {slots.title && (
          <div class="w-full h-full flex items-center bg-slate-100">
            {slots.title()}
          </div>
        )}
        <div class="w-full h-full p-2 flex">
          {slots.default && slots.default()}
        </div>
      </div>
    );
  },
});
