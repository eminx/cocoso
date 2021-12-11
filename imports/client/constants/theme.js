import { extendTheme } from "@chakra-ui/react";

const theme = {
  spacing: 12,
  global: {
    font: {
      family: "'Sarabun', sans-serif;",
      size: '15px',
      height: '24px',
    },
    colors: {
      focus: 'orange',
    },
  },
  avatar: {
    text: {
      fontWeight: 700,
    },
  },
  formField: {
    border: false,
  },
  heading: {
    extend: (props) => ({
      marginBottom: 12,
    }),
  },
  layer: {
    container: {
      extend: (props) => ({
        overflow: 'scroll',
      }),
    },
  },
  list: {
    item: {
      border: false,
    },
  },
};

const chakraTheme = extendTheme({
  fonts: {
    heading: 'Sarabun, sans-serif',
    body: 'Sarabun, sans-serif',
  },
});

export { chakraTheme };
export default theme;
