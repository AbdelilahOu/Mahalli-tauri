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
    LinkPath: {
      type: String,
      default: "/",
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
      <RouterLink to={props.LinkPath}>
        <span
          class={`w-full flex h-9 rounded-md items-center py-1 px-2 hover:bg-white group transition-all duration-300 ${
            props.IsText ? "justify-start" : "justify-center"
          }`}
        >
          <UiIconVue
            IsStyled={true}
            class={"min-w-[40px] group-hover:text-primary text-white"}
            name={props.Icon}
          />
          {props.IsText ? (
            <span class="text-white ml-1 whitespace-nowrap group-hover:text-primary">
              {props.LinkText}
            </span>
          ) : (
            <span class="w-full "></span>
          )}
        </span>
      </RouterLink>
    );
  },
});
