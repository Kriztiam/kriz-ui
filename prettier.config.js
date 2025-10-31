/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */

const config = {
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  trailingComma: "es5",
  printWidth: 80,
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  importOrder: [
    "/.*.module.(css|scss)$",
    "<THIRD_PARTY_MODULES>",
    "^@/i18n/(.*)$",
    "^@/components/ui/(.*)$",
    "^@/components/(.*)$",
    "^@/layouts/(.*)$",
    "^@/utils/(.*)$",
    "^@/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
};

export default config;
