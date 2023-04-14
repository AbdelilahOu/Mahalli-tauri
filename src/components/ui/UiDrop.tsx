import { defineComponent } from "vue";

export const UiDrop = defineComponent({
  name: "UiDrop",
  setup(props, ctx) {
    return () => <div drop>a</div>;
  },
});
