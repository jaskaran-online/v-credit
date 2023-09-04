module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'plugin:prettier/recommended', // Add this line
  ],
  plugins: ['import', 'react'],
  rules: {
    'import/no-unused-modules': 'error',
    // Detect and report unused modules
    'react/jsx-no-undef': 'error',
    // Detect and report undeclared variables in JSX
  },
};
