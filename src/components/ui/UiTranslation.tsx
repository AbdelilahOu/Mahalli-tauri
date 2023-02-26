import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

export const UiTranslation = defineComponent({
  name: "UiTranslation",
  props: {
    Key: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n();
    return () => t(`${String(useRoute().name)}.${props.Key}`);
  },
});
