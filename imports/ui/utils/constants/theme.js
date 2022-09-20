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
        textTransform: 'uppercase',
        paddingLeft: 0,
        paddingRight: 0,
        marginLeft: 12,
        marginRight: 12,
        '&:focus': {
          boxShadow: 'none',
        },
        '&:nth-child(0)': {
          marginLeft: 0,
        },
        '&:nth-last-child(0)': {
          marginRight: 0,
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
