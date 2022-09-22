import { extendTheme } from '@chakra-ui/react';

const chakraTheme = extendTheme({
  colors: {
    gray: {
      100: 'rgb(245, 245, 245)',
      200: 'rgb(235, 235, 235)',
      300: 'rgb(215, 215, 215)',
      400: 'rgb(175, 175, 175)',
      500: 'rgb(155, 155, 155)',
      600: 'rgb(135, 135, 135)',
      700: 'rgb(115, 115, 115)',
      800: 'rgb(55, 55, 55)',
      900: 'rgb(55, 55, 55)',
    },
  },
  components: {
    Tabs: {
      defaultProps: {
        colorScheme: 'gray.800',
      },
    },
    TabList: {
      defaultProps: {
        flexWrap: 'wrap',
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
