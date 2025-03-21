export const appConfig = {
  i18n: {
    locales: ["en", "de", "es"],
    defaultLocale: "en",
    localeLabels: {
      en: "English",
      es: "Español",
      de: "Deutsch",
    },
    localeCurrencies: {
      /* This only works with Stripe for now. For LemonSqueezy, we need to set the currency in the LemonSqueezy dashboard and there can only be one. */
      en: "USD",
      de: "USD",
      es: "USD",
    },
  },
  billing: {
    productIds: {
      base: "prod_123",
      premium: "prod_456",
      ultimate: "prod_789",
    },
  },
} as const;
