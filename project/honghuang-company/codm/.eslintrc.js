module.exports = {
  root: true,
  extends: ['@tencent/eslint-config-tencent'],
  parserOptions: {
    ecmaVersion: 10,
    sourceType: 'module',
  },
  rules: {
    // 设置默认eslint规则
    'no-debugger': 0,
    'no-console': 0,
    'no-plusplus': 0,
    'no-mixed-operators': 0,
  },
  globals: {
    globalThis: false, // means it is not writeable
  },
  overrides: [{
    files: ['*.vue'],
    plugins: ['vue'],
    env: {
      browser: true,
      node: true,
    },
    extends: [
      'plugin:vue/recommended',
    ],
    rules: {
      'vue/no-v-html': 'off',
      'vue/require-default-prop': 0,
    }
  },
  // 设置typescript-eslint规则
  {
    files: ['*.ts', '*.tsx'],
    plugins: ['prettier'],
    extends: [
      '@tencent/eslint-config-tencent/ts',
    ],
    parserOptions: {
      env: {
        es6: true,
        node: true,
        browser: true,
      },
      sourceType: 'module',
      project: './tsconfig.json',
      "ecmaFeatures": {
        "legacyDecorators": true
      }
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 0,
      '@typescript-eslint/prefer-for-of': 0,
      'no-restricted-syntax': 0,
      'prefer-destructuring': 0,
      'no-param-reassign': 0,
    },
  },
  {
    "files": [
      "**/__tests__/*.{j,t}s?(x)",
      "**/tests/unit/**/*.spec.{j,t}s?(x)"
    ],
    "env": {
      "jest": true
    }
  }
  ],
};
