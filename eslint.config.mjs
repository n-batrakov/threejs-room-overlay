const rules = {
  'jsx-a11y/label-has-associated-control': 'off',
  'react/jsx-one-expression-per-line': 'off',
  'react/jsx-props-no-multi-spaces': 'off',
  'react/destructuring-assignment': 'off',
  'react/no-array-index-key': 'warn',
  'react/jsx-props-no-spreading': 'off',
  'react/jsx-filename-extension': 'off',
  'react/prop-types': 'off',
  'react-hooks/exhaustive-deps': 'off',
  'react/require-default-props': 'off',
  'react/function-component-definition': 'off',
  'react/jsx-no-useless-fragment': 'off',
  'react/no-unknown-property': ['error', { ignore: ['css'] }],
  'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
  'arrow-body-style': 'warn',
  'implicit-arrow-linebreak': 'off',
  'import/prefer-default-export': 'off',
  'max-len': ['warn', { code: 150 }],
  'max-classes-per-file': 'off',
  'no-param-reassign': 'warn',
  'no-underscore-dangle': 'warn',
  'no-shadow': 'off',
  'no-plusplus': 'off',
  'no-confusing-arrow': 'off',
  'no-else-return': 'off',
  'no-console': ['warn', { allow: ['warn', 'error'] }],
  'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 0, maxBOF: 0 }],
  'no-restricted-exports': 'off',
  'no-unused-vars': 'off',
  'object-curly-newline': ['error', { multiline: true, consistent: true }],
  '@typescript-eslint/no-shadow': 'off',
  '@typescript-eslint/no-unused-vars': 'warn',
  'import/extensions': [
    'error',
    'never',
    {
      svg: 'always',
    }
  ]
};

import js from "@eslint/js";
import tsParser from '@typescript-eslint/parser';
import tsEslint from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      import: importPlugin,
      react: reactPlugin,
      '@typescript-eslint': tsEslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: globals.browser,
    },
    rules,
  },
];
