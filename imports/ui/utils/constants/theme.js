import { extendTheme } from '@chakra-ui/react';

const chakraTheme = extendTheme({
  colors: {
    gray: {
      100: 'rgb(245, 245, 245)',
      200: 'rgb(235, 235, 235)',
      300: 'rgb(225, 225, 225)',
      400: 'rgb(215, 215, 215)',
      500: 'rgb(165, 165, 165)',
      600: 'rgb(115, 115, 115)',
      700: 'rgb(95, 95, 95)',
      800: 'rgb(75, 75, 75)',
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
