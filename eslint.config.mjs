import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

const importRules = {
  'import/order': [
    'error',
    {
      groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true },
    },
  ],
  'import/no-duplicates': 'error',
  'import/no-self-import': 'error',
  'import/no-useless-path-segments': 'error',
  'import/newline-after-import': ['error', { count: 1 }],
};

const typescriptRules = {
  '@typescript-eslint/consistent-type-imports': [
    'error',
    { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
  ],
  '@typescript-eslint/no-unused-vars': [
    'error',
    { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
  ],
  '@typescript-eslint/no-explicit-any': 'error',
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      ...importRules,
      ...typescriptRules,
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  prettier,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'node_modules/**']),
]);

export default eslintConfig;
