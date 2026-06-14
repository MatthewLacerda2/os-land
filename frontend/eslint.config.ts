import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import betterTailwind from "eslint-plugin-better-tailwindcss";
import tseslint from "typescript-eslint";
import local from "./eslint-rules/index";

// Classes that are legitimately not Tailwind utilities (structural hooks and
// custom component classes declared in @layer components), so the color
// allowlist rule must not flag them as unregistered.
const NON_TAILWIND_CLASSES = [
  "^dark$",
  "^group($|/)",
  "^peer($|/)",
  "^mobile-container$",
];

export default tseslint.config(
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  // App + plugin source.
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      local,
      "better-tailwindcss": betterTailwind,
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: "src/index.css",
      },
    },
    rules: {
      // --- Local design-system rules: all ERROR. ---
      "local/one-exported-component-per-file": "error",
      "local/no-arbitrary-text": "error",
      "local/no-color-literal": "error",
      "local/no-hand-rolled-form-control": "error",

      // --- Color allowlist via the real theme. ---
      "better-tailwindcss/no-unregistered-classes": [
        "error",
        { ignore: NON_TAILWIND_CLASSES },
      ],

      // --- File length. ---
      "max-lines": ["error", { max: 550 }],
    },
  },
  // components/ui primitives are vendored shadcn code: exempt from the
  // design-system, one-component, and color-allowlist rules.
  {
    files: ["src/components/ui/**"],
    rules: {
      "local/one-exported-component-per-file": "off",
      "local/no-hand-rolled-form-control": "off",
      "local/no-arbitrary-text": "off",
      "local/no-color-literal": "off",
      "better-tailwindcss/no-unregistered-classes": "off",
      // Vendored shadcn primitives export variant helpers alongside the component.
      "react-refresh/only-export-components": "off",
    },
  },
  // ESLint rule sources and their tests are Node modules, not DOM/Tailwind code.
  {
    files: ["eslint-rules/**"],
    rules: {
      "better-tailwindcss/no-unregistered-classes": "off",
      "local/one-exported-component-per-file": "off",
      "local/no-hand-rolled-form-control": "off",
      "local/no-color-literal": "off",
      "local/no-arbitrary-text": "off",
    },
  },
);
