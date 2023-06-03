import { defineComponent } from "vue";

export const ChartHolder = defineComponent({
  name: "ChartHolder",
  props: {
    title: String,
  },
  setup({ title }, { slots }) {
    return () => (
      <div class="w-full h-full flex flex-col">
        <div class="w-full h-full flex">{slots.default && slots.default()}</div>
        <h1>{title}</h1>
      </div>
    );
  },
});
