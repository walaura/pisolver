import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
  {
    ignores: ["dist/"],
    plugins: {
      "react-hooks": {
        rules: {
          "react-hooks/rules-of-hooks": "error",
          "react-hooks/exhaustive-deps": "warn",
        },
      },
      "unused-imports": {
        rules: {
          "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
          "unused-imports/no-unused-imports": "error",
          "unused-imports/no-unused-vars": [
            "warn",
            {
              vars: "all",
              varsIgnorePattern: "^_",
              args: "after-used",
              argsIgnorePattern: "^_",
            },
          ],
        },
      },
    },
  },
];
