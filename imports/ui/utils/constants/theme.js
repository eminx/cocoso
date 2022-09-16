import { extendTheme } from '@chakra-ui/react';

const chakraTheme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        __focus: {
          boxShadow: 'none',
        },
      },
    },
    Tabs: {
      defaultProps: {
        colorScheme: 'gray.800',
      },
    },
  },
  fonts: {
    heading: "'Charter-bold', sans-serif",
    body: "'Charter-regular', sans-serif",
  },
});

export { chakraTheme };
