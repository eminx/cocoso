import { defineStyle, extendTheme } from '@chakra-ui/react';

const brand = (hue, lightness) => `hsl(${hue}deg, 80%, ${lightness}%)`;

const luxxStyle = {
  field: {
    borderColor: 'gray.500',
    borderRadius: '6px',
    borderWidth: '2px',
    _hover: {
      borderColor: 'gray.600',
    },
    _focus: {
      borderColor: 'brand.500',
    },
  },
};

const generateTheme = (hue) => {
  const color = brand(hue, '40');

  const theme = extendTheme({
    // fontFamily: {
    //   heading: `'Raleway', ${baseTheme.fonts?.heading}`,
    //   body: `'Sarabun', ${baseTheme.fonts?.body}`,
    // },
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
        50: 'rgb(250, 248, 245)',
        100: 'rgb(245, 243, 240)',
        200: 'rgb(235, 233, 230)',
        300: 'rgb(225, 222, 220)',
        400: 'rgb(215, 212, 210)',
        500: 'rgb(155, 152, 150)',
        600: 'rgb(85, 82, 80)',
        700: 'rgb(65, 62, 60)',
        800: 'rgb(45, 42, 40)',
        900: 'rgb(25, 22, 20)',
      },
    },
    components: {
      Button: {
        baseStyle: {
          // borderRadius: 0,
          whiteSpace: 'normal',
        },
        defaultProps: {
          colorScheme: 'brand',
        },
      },
      Heading: defineStyle({
        baseStyle: {
          fontFamily: 'Raleway',
        },
      }),
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
      Menu: {
        baseStyle: {
          list: {
            // borderColor: 'brand.500',
            // borderRadius: 0,
          },
        },
      },
      Modal: {
        baseStyle: {
          dialog: {
            backgroundColor: '#fff',
            // borderRadius: 0,
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
          colorScheme: 'brand',
          focusBorderColor: color,
          variant: 'luxx',
          borderWidth: '2px',
        },
        variants: {
          luxx: luxxStyle,
        },
      },
    },
    styles: {
      global: () => ({
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

export default generateTheme;
