module.exports = {
  
  extends: [
    'eslint:recommended',
    'airbnb',
  ],
  
  parser: 'babel-eslint',
  
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  
  env: {
    browser: true,
    es6: true,
    mocha: true,
    node: true,
  },
  
  globals: {
    document: true,
  },
  
  rules: {
    'class-methods-use-this': 'off',
    'jsx-quotes': ['error', 'prefer-single'],
    'max-len': 'off',
    'no-alert': 'warn',
    'no-confusing-arrow': 'off',
    'no-console': 'error',
    'no-empty-function': 'off',
    'no-param-reassign': 'warn',
    'no-return-await': 'off',
    'no-return-assign': 'off',
    'no-shadow': 'off',
    'no-trailing-spaces': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-expressions': ['error', { 'allowTaggedTemplates': true }],
    'no-unused-vars': 'warn',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true },],
    'prefer-const': 'off',
    'react/jsx-boolean-value': ['error', 'always'],
    'react/jsx-filename-extension': ['error', { 'extensions': ['.js', '.jsx'] }],
    'react/forbid-prop-types': 'off',
    'react/no-array-index-key': 'warn',
    'react/no-danger': 'warn',
    'react/no-unused-prop-types': 'warn',
    'react/prop-types': 'off',
    'react/require-default-props': 'warn',
    'jsx-a11y/html-has-lang': 'warn',
  },
  
  plugins: [
    'import',
    'jsx-a11y',
    'react',
  ],
  
};
