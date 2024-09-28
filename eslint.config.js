import vuePlugin from 'eslint-plugin-vue';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
export default [
    {
        ignores: ['node_modules/**', 'dist/**'],
    },
    {
        files: ['**/*.ts', '**/*.vue'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 'latest', // Ensure ECMAScript latest support
                sourceType: 'module', // Enable ES6+ modules
                ecmaFeatures: {
                    jsx: false, // Disable JSX support if not needed
                },
            },
        },
        plugins: {
            vue: vuePlugin,
            '@typescript-eslint': typescriptPlugin,
            prettier: prettierPlugin, // Integrate Prettier
        },
        rules: {
            'vue/multi-word-component-names': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            'prettier/prettier': 'error', // Make Prettier errors show as ESLint errors
            'vue/no-parsing-error': 'off'
        },
    },
    prettierConfig, // Disable ESLint rules that conflict with Prettier
];