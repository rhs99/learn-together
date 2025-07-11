module.exports = [
  {
    languageOptions: {
      sourceType: 'commonjs',
      ecmaVersion: 'latest',
      globals: {
        // Global variables for Node.js environment
        process: 'readonly',
        console: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'commonjs',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    files: ['src/**/*.js'],
    rules: {
      'no-console': 'off',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'no-unused-vars': ['error', { 'argsIgnorePattern': 'next' }],
      'no-undef': 'error',
      'prefer-const': 'error'
    }
  }
];
