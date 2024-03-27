module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  rules: {
    "no-use-before-define": ["error", { "variables": false }],
    "import/order": [
      2,
      {
        "groups": ["builtin", "external", "internal", ["index", "sibling", "parent"]],
        "pathGroups": [
          {
            // Configure react libs to be on top of external modules
            "pattern": "{react*,react*/**}",
            "group": "external",
            "position": "before"
          },
          {
            // Configure @flagship.io to be last external modules
            "pattern": "@flagship.io/**",
            "group": "internal",
            "position": "after"
          },
        ],
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        },
        "newlines-between": "always",
        "pathGroupsExcludedImportTypes": ["builtin"]
      }
    ]
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
