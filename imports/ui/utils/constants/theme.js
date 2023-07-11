import { extendTheme } from '@chakra-ui/react';

const brand = (hue, level) => `hsl(${hue}deg, 50%, ${level}%)`;

const generateTheme = (hue) => {
  const color = brand(hue, '50');

  const theme = extendTheme({
    fonts: {
      heading: "'Raleway', sans-serif",
      body: "'Raleway', sans-serif",
    },
    colors: {
      brand: {
        50: brand(hue, '95'),
        100: brand(hue, '90'),
        200: brand(hue, '80'),
        300: brand(hue, '70'),
        400: brand(hue, '60'),
        500: brand(hue, '50'),
        600: brand(hue, '40'),
        700: brand(hue, '30'),
        800: brand(hue, '20'),
        900: brand(hue, '10'),
      },
      gray: {
        100: 'rgb(245, 245, 245)',
        200: 'rgb(235, 235, 235)',
        300: 'rgb(225, 225, 225)',
        400: 'rgb(215, 215, 215)',
        500: 'rgb(155, 155, 155)',
        600: 'rgb(85, 85, 85)',
        700: 'rgb(65, 65, 65)',
        800: 'rgb(45, 45, 45)',
        900: 'rgb(25, 25, 25)',
      },
    },
    components: {
      Button: {
        defaultProps: {
          colorScheme: 'brand',
        },
      },
      Input: {
        baseStyle: {
          _focus: {
            backgroundColor: '#fff',
          },
        },
        defaultProps: {
          focusBorderColor: color,
          variant: 'filled',
          _placeholderShown: { opacity: 0.7, color: 'gray.700' },
        },
      },
      Select: {
        defaultProps: {
          focusBorderColor: color,
          variant: 'filled',
          colorScheme: 'brand',
        },
      },
      Switch: {
        defaultProps: {
          colorScheme: 'brand',
        },
      },
      Tabs: {
        defaultProps: {
          colorScheme: 'brand',
        },
      },
      TabList: {
        defaultProps: {
          flexWrap: 'wrap',
        },
      },
      Textarea: {
        defaultProps: {
          variant: 'filled',
          colorScheme: 'brand',
        },
      },
    },
    styles: {
      global: {
        a: {
          color,
        },
      },
    },
  });

  return theme;
};

export { generateTheme };
