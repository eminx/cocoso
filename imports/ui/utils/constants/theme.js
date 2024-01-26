import { defineStyleConfig, extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const brand = (hue, level) => `hsl(${hue}deg, 80%, ${level}%)`;

const generateTheme = (hue) => {
  const color = brand(hue, '32');

  const Input = defineStyleConfig({
    variants: {
      outline: {
        borderRadius: '0',
        backgroundColor: 'brand.50',
        borderColor: 'brand',
      },
    },
    defaultProps: {
      colorScheme: 'brand',
      focusBorderColor: color,
      variant: 'outline',
      _placeholderShown: { opacity: 0.7, color: 'gray.700' },
    },
  });

  const theme = extendTheme({
    // fontFamily: {
    //   heading: `'Raleway', ${baseTheme.fonts?.heading}`,
    //   body: `'Sarabun', ${baseTheme.fonts?.body}`,
    // },
    initialColorMode: 'dark',
    colors: {
      brand: {
        50: brand(hue, '95'),
        100: brand(hue, '90'),
        200: brand(hue, '85'),
        300: brand(hue, '75'),
        400: brand(hue, '65'),
        500: brand(hue, '50'),
        600: brand(hue, '35'),
        700: brand(hue, '25'),
        800: brand(hue, '15'),
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
      Input,
      Select: {
        defaultProps: {
          colorScheme: 'brand',
          focusBorderColor: color,
          variant: 'outline',
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
          focusBorderColor: color,
          variant: 'outline',
          colorScheme: 'brand',
        },
      },
    },
    styles: {
      global: (props) => ({
        body: {
          // color: mode('gray.800', 'whiteAlpha.900')(props),
          // bg: mode('gray.100', '#141214')(props),
          fontFamily: 'Sarabun',
        },
      }),
    },
  });

  return theme;
};

export { generateTheme };
