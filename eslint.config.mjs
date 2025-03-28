import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default defineConfig([
  tseslint.configs.recommended,

  {
    files: ["**/*.{jsx,tsx}"],
    ...  pluginReact.configs.flat.recommended,
    languageOptions: {
      ...  pluginReact.configs.flat.recommended.languageOptions,
      globals: globals.browser,
      parser: tseslint.ESLintParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: ["./tsconfig.json"]
      },
    },
    plugins: { js },
    extends: ["js/recommended"],
    rules: {

      "no-console": "error",
      "no-debugger": "error",
      "no-alert": "error",


      "complexity": ["error", 15],
      "max-depth": ["error", 3],
      "max-params": ["error", 4],
      "no-duplicate-imports": "error",

      "no-restricted-globals": "error",
      "prefer-const": "error",
      "no-var": "error",

      "@typescript-eslint/explicit-function-return-type": ["error", {
        "allowExpressions": true,  
        "allowTypedFunctionExpressions": true,  
        "allowHigherOrderFunctions": true, 
        "allowDirectConstAssertionInArrowFunctions": true,
        "allowConciseArrowFunctionExpressionsStartingWithVoid": true
      }],
      "@typescript-eslint/no-explicit-any": ["warn", {
        "ignoreRestArgs": false,
        "fixToUnknown": false
      }],
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",

      
    },

  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json"]
      }
    },
    rules: {

      "no-console": "error",
      "no-debugger": "error",
      "no-alert": "error",

      "complexity": ["error", 15],
      "max-depth": ["error", 3],
      "max-params": ["error", 4],
      "no-duplicate-imports": "error",


      "no-restricted-globals": "error",
      "prefer-const": "error",
      "no-var": "error",


      "@typescript-eslint/explicit-function-return-type": ["error", {
        "allowExpressions": true,  
        "allowTypedFunctionExpressions": true,  
        "allowHigherOrderFunctions": true, 
        "allowDirectConstAssertionInArrowFunctions": true,
        "allowConciseArrowFunctionExpressionsStartingWithVoid": true
      }],
      "@typescript-eslint/no-explicit-any": ["warn", {
        "ignoreRestArgs": false,
        "fixToUnknown": false
      }],
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/ban-ts-comment": "warn"
    }
  },
]);
