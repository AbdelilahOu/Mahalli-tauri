import { defineComponent } from "vue";

export const Sittings = defineComponent({
  setup() {
    return (
      <div class="w-1/2 h-fit z-50 gap-3 rounded-[4px] flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          Sittings
        </h1>
        <div class="h-full w-full flex  flex-col gap-2"></div>;
      </div>
    );
  },
});
