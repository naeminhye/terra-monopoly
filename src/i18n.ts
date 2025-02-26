import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "@/locales/en/translation.json";
import viTranslation from "@/locales/vi/translation.json";
import koTranslation from "@/locales/ko/translation.json";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: { translation: enTranslation },
      vi: { translation: viTranslation },
      ko: { translation: koTranslation },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
