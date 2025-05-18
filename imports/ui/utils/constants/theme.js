import { extendTheme } from '@chakra-ui/react';

const brand = (hue, lightness) => `hsl(${hue}deg, 80%, ${lightness}%)`;

export const luxxStyle = {
  field: {
    backgroundColor: 'white',
    borderColor: 'gray.300',
    borderRadius: '8px',
    borderWidth: '2px',
    _hover: {
      borderColor: 'gray.500',
    },
    _focus: {
      borderColor: 'gray.600',
    },
  },
};

const generateTheme = (hue) => {
  const color = brand(hue, '40');

  const theme = extendTheme({
    initialColorMode: 'dark',
    colors: {
      brand: {
        50: brand(hue, '97'),
        100: brand(hue, '92'),
        200: brand(hue, '85'),
        300: brand(hue, '75'),
        400: brand(hue, '65'),
        500: brand(hue, '40'),
        600: brand(hue, '32'),
        700: brand(hue, '20'),
        800: brand(hue, '12'),
        900: brand(hue, '8'),
      },
      gray: {
        50: 'rgb(250, 247, 245)',
        100: 'rgb(240, 235, 230)',
        200: 'rgb(228, 222, 218)',
        300: 'rgb(215, 210, 208)',
        400: 'rgb(205, 200, 195)',
        500: 'rgb(155, 148, 140)',
        600: 'rgb(88, 80, 75)',
        700: 'rgb(68, 60, 52)',
        800: 'rgb(48, 40, 32)',
        900: 'rgb(25, 20, 15)',
      },
      blueGray: {
        50: '#f4f7ff',
        100: '#E0E5F2',
        200: '#E1E9F8',
        300: '#CDD5EA',
        400: '#BEC9E4',
        500: '#8F9BBA',
        600: '#A3AED0',
        700: '#707EAE',
        800: '#505b81',
        900: '#1B2559',
      },
    },
    components: {
      Button: {
        baseStyle: {
          whiteSpace: 'normal',
        },
        defaultProps: {
          colorScheme: 'brand',
        },
      },
      Checkbox: {
        defaultProps: {
          colorScheme: 'brand',
        },
        variants: {
          luxx: luxxStyle,
        },
      },
      Heading: {
        baseStyle: {
          fontFamily: 'Raleway',
        },
      },
      Input: {
        defaultProps: {
          _placeholderShown: { opacity: 0.71, color: 'gray.700' },
          focusBorderColor: color,
          variant: 'luxx',
        },
        variants: {
          luxx: luxxStyle,
        },
      },
      Modal: {
        baseStyle: {
          dialog: {
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
          },
        },
      },
      NumberInput: {
        defaultProps: {
          colorScheme: 'brand',
          focusBorderColor: color,
          variant: 'luxx',
        },
        variants: {
          luxx: luxxStyle,
        },
      },
      Select: {
        defaultProps: {
          colorScheme: 'brand',
          focusBorderColor: color,
          variant: 'luxx',
        },
        variants: {
          luxx: luxxStyle,
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
      Tag: {
        defaultProps: {
          borderRadius: '0',
          border: '1px solid',
          borderColor: 'gray.500',
        },
      },
      Textarea: {
        defaultProps: {
          borderWidth: '2px',
          borderColor: 'gray.300',
          colorScheme: 'brand',
          focusBorderColor: color,
          variant: 'luxx',
        },
        variants: {
          luxx: luxxStyle,
        },
      },
    },
    styles: {
      global: () => ({
        body: {
          fontFamily: 'Sarabun',
        },
      }),
    },
  });

  return theme;
};

export default generateTheme;
