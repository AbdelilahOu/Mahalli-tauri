export default defineI18nConfig(() => ({
  legacy: false,
  availableLocales: ["en", "fr", "ar", "de"],
  //@ts-ignore
  datetimeFormats,
  //@ts-ignore
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
  US: {
    currency: {
      style: "currency",
      currency: "USD",
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
  EU: {
    currency: {
      style: "currency",
      currency: "EUR",
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
  en: DEFAULT_NUMBER_FORMATS.US,
  fr: DEFAULT_NUMBER_FORMATS.EU,
  ar: DEFAULT_NUMBER_FORMATS.EU,
  de: DEFAULT_NUMBER_FORMATS.AR,
};
