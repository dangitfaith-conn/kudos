import { extendTheme } from '@chakra-ui/react';

// 1. Define custom colors
const colors = {
  brand: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3', // Primary brand color
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },
};

// 2. Define component style overrides
const components = {
  Button: {
    // All buttons will have a default color scheme of 'brand'
    defaultProps: {
      colorScheme: 'brand',
    },
  },
  Input: {
    // All inputs will have a custom focus border color
    variants: {
      outline: {
        field: {
          _focusVisible: {
            borderColor: 'brand.500',
            boxShadow: `0 0 0 1px var(--chakra-colors-brand-500)`,
          },
        },
      },
    },
  },
};

// 3. Export the custom theme
export const theme = extendTheme({
  colors,
  components,
});