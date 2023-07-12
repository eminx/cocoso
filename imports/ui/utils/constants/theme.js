import { extendTheme, theme as baseTheme } from '@chakra-ui/react';

const brand = (hue, level) => `hsl(${hue}deg, 50%, ${level}%)`;

const generateTheme = (hue) => {
  const color = brand(hue, '32');

  const theme = extendTheme({
    fontFamily: {
      heading: `'Raleway', ${baseTheme.fonts?.heading}`,
      body: `'Sarabun', ${baseTheme.fonts?.body}`,
    },
    colors: {
      brand: {
        50: brand(hue, '95'),
        100: brand(hue, '90'),
        200: brand(hue, '75'),
        300: brand(hue, '60'),
        400: brand(hue, '40'),
        500: brand(hue, '32'),
        600: brand(hue, '25'),
        700: brand(hue, '18'),
        800: brand(hue, '14'),
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
      Heading: {
        defaultProps: {
          fontFamily: 'Raleway',
        },
      },
      Input: {
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
        body: {
          fontFamily: 'Sarabun',
        },
        a: {
          color,
          textShadow: '0.5px 0.5px 0.5px #fff',
        },
      },
    },
  });

  return theme;
};

export { generateTheme };
