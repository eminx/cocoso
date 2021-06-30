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

export default theme;
