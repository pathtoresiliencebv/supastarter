import { config } from "@config";

/**
 * Uses the values defined in `i18n.config.ts`
 */
export const useLocaleCurrency = () => {
  const { locale, getNumberFormat } = useI18n();

  const localeCurrency = computed(() => {
    return (
      (getNumberFormat(locale.value)?.currency?.currency as string | null) ||
      config.i18n.defaultCurrency
    );
  });

  return {
    localeCurrency,
  };
};
