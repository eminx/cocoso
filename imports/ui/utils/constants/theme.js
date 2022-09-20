import { extendTheme } from '@chakra-ui/react';

const chakraTheme = extendTheme({
  components: {
    Tabs: {
      defaultProps: {
        colorScheme: 'gray.800',
      },
    },
    Tab: {
      baseStyle: {
        '&:focus': {
          boxShadow: 'none',
        },
      },
    },
  },
  fonts: {
    // heading: "'Charter-bold', 'Sarabun', sans-serif",
    heading: "'Sarabun', sans-serif",
    body: "'Sarabun', sans-serif",
  },
});

export { chakraTheme };
