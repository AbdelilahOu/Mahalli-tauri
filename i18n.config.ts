export default defineI18nConfig(() => ({
  legacy: false,
  availableLocales: ["en", "fr", "ar", "de"],
  // @ts-ignore
  datetimeFormats,
  // @ts-ignore
  numberFormats,
}));

const DEFAULT_DATE_TIME_FORMAT = {
  short: {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
  monthOnly: {
    month: "long",
  },
  long: {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
  },
};

const DEFAULT_NUMBER_FORMATS = {
  AR: {
    currency: {
      style: "currency",
      currency: "MAD",
      notation: "standard",
    },
    decimal: {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    percent: {
      style: "percent",
      useGrouping: false,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
};

const datetimeFormats = {
  en: DEFAULT_DATE_TIME_FORMAT,
  fr: DEFAULT_DATE_TIME_FORMAT,
  ar: DEFAULT_DATE_TIME_FORMAT,
  de: DEFAULT_DATE_TIME_FORMAT,
};

const numberFormats = {
  en: DEFAULT_NUMBER_FORMATS.AR,
  fr: DEFAULT_NUMBER_FORMATS.AR,
  ar: DEFAULT_NUMBER_FORMATS.AR,
  de: DEFAULT_NUMBER_FORMATS.AR,
};
