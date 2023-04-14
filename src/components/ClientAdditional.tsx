import { defineComponent } from "vue";

export const ClientAdditional = defineComponent({
  name: "ClientAdditional",
  setup() {
    return () => (
      <div
        v-aaaaa
        draggable={true}
        class="w-full rounded-md h-full xl:sticky xl:top-[275px] z-20 bg-gray-200"
      ></div>
    );
  },
});
