import { light as evaLight } from '@eva-design/eva';

// theme/lightTheme.ts
export const lightTheme = {
    ...evaLight,

  // Colores base
  'color-primary-500': '#03A9F4',
  'background-basic-color-1': '#03A9F4',

  // 👇 Aquí cambiamos todos los textos a blanco
  'text-basic-color': '#FFFFFF',
  'text-alternate-color': '#FFFFFF',
  'text-control-color': '#FFFFFF',
  'text-hint-color': '#E0F7FA', // Un blanco suave para hints
};