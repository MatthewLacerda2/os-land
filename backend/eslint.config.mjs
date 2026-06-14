// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'max-lines': ['error', { max: 350, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': [
        'error',
        { max: 50, skipBlankLines: true, skipComments: true },
      ],
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
  {
    files: ['**/*.spec.ts', 'test/**'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
    },
  },
);
