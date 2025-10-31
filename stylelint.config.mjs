/** @type {import("stylelint").Config} */

const stylelintConfig = {
  extends: ["stylelint-config-standard"],
  rules: {
    "selector-class-pattern": "^[A-Z][a-zA-Z0-9]*$",
    "custom-property-pattern": "^[a-z][a-zA-Z0-9]*$",
    "custom-media-pattern": "^[a-z][a-zA-Z0-9]*$",
    "custom-property-empty-line-before": null,
    "media-feature-range-notation": "prefix",
    "color-no-hex": true,
    "alpha-value-notation": "number",
    "hue-degree-notation": "number",
    "color-function-alias-notation": null,
    "function-disallowed-list": ["rgb", "hwb", "lch"],
    "number-max-precision": 6,
    "comment-no-empty": true,
    "declaration-block-no-duplicate-properties": true,
    "declaration-block-no-shorthand-property-overrides": true,
    "no-descending-specificity": null,
    "property-disallowed-list": ["float", "clear"],
    "unit-disallowed-list": [
      "px",
      {
        severity: "warning",
        ignoreProperties: {
          px: ["filter", "backdrop-filter"],
        },
        ignoreMediaFeatureNames: {
          px: [
            "width",
            "min-width",
            "max-width",
            "height",
            "min-height",
            "max-height",
          ],
        },
      },
    ],
  },
  ignoreFiles: ["dist/**"],
};

export default stylelintConfig;
