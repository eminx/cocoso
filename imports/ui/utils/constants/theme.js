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
    heading: "'Charter-bold', sans-serif",
    body: "'Charter-regular', sans-serif",
  },
});

export { chakraTheme };
