import nextPlugin from '@next/eslint-plugin-next';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'dist/**', 'build/**']
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'next': nextPlugin
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'jsx-a11y/alt-text': 'warn',
      
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { 
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_' 
      }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      
      'next/core-web-vitals': 'error',
      'next/no-img-element': 'warn',
      'next/no-html-link-for-pages': 'warn',
      
      'semi': ['error', 'always'],
      'quotes': ['warn', 'single'],
      'indent': ['warn', 2],
      'comma-dangle': ['warn', 'never'],
      'arrow-parens': ['warn', 'always']
    }
  },
  {
    files: ['**/*.js', '**/*.jsx', '**/*.mjs'],
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended'
    ],
    plugins: {
      'next': nextPlugin
    },
    rules: {
      'semi': ['error', 'always'],
      'quotes': ['warn', 'single'],
      'next/core-web-vitals': 'error'
    }
  }
];