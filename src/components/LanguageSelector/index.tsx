import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const languages = [
  { code: "en", label: "🇺🇸 English" },
  { code: "vi", label: "🇻🇳 Tiếng Việt" },
  { code: "ko", label: "🇰🇷 한국어" },
];

const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="outline">🌐 {t("changeLanguage")}</Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="popover-content bg-white p-3 rounded-md shadow-lg border">
          <div className="flex flex-col gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className="px-3 py-2 hover:bg-gray-100 rounded-md transition"
              >
                {lang.label}
              </button>
            ))}
          </div>
          <Popover.Close className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer">
            ✖
          </Popover.Close>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default LanguageSelector;
