module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'react/react-in-jsx-scope': 'off', // Desactiva el warning de React en JSX
    'react-native/no-inline-styles': 'off', // Desactiva el warning de estilos en línea
    'no-unused-vars': 'off',
  },
};
