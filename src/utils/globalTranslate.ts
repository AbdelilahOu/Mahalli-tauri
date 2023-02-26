import { useI18n } from "vue-i18n";

export const globalTranslate = (key: string) => {
  const { t } = useI18n();
  return t(key);
};
