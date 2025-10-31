"use client";

import { useLocale, useTranslations } from "next-intl";
import InputSelect from "@/components/InputSelect/InputSelect";
import { useNavigation } from "@/context/NavigationContext";
import { useRouting } from "@/context/RoutingContext";

export default function SelectorLanguage() {
  const locale = useLocale();
  const t = useTranslations("Common.Language");
  const { pathname, router } = useNavigation();
  const routing = useRouting();
  return (
    <div>
      <InputSelect
        labelText={t("language")}
        options={routing.locales.map((localeCode) => ({
          value: localeCode,
          label: t(localeCode),
        }))}
        defaultSelected={locale}
        disabledElements={[""]}
        onChange={(selectedValue: string) => {
          router.push(pathname, { locale: selectedValue as typeof locale });
        }}
      />
    </div>
  );
}
