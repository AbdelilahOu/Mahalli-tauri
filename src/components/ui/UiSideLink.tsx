import { defineComponent } from "vue";
import { RouterLink } from "vue-router";
import UiIconVue from "./UiIcon.vue";

export const UiSideLink = defineComponent({
  name: "UiSideLink",
  props: {
    IsText: {
      type: Boolean,
      required: true,
    },
    LinkText: {
      type: String,
      required: true,
    },
    Icon: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    return () => (
      <span
        class={`w-full flex h-9 rounded-md items-center py-1 px-2 hover:bg-white group transition-all duration-300 ${
          props.IsText ? "justify-start" : "justify-center"
        }`}
      >
        <UiIconVue
          IsStyled={false}
          class={
            "min-w-[30px] h-[30px] w-[30px] max-w-[30px] group-hover:text-primary transition-all duration-150 text-gray-400"
          }
          name={props.Icon}
        />
        {props.IsText ? (
          <span class="text-gray-500 ml-1 whitespace-nowrap group-hover:text-primary">
            {props.LinkText}
          </span>
        ) : (
          <span class="w-full "></span>
        )}
      </span>
    );
  },
});
