// Custom CSS Provider to replace ChakraProvider
import React from 'react';

interface CocosoCSSProviderProps {
  children: React.ReactNode;
  hue?: string | number;
}

export default function CocosoCSSProvider({
  children,
  hue = '233',
}: CocosoCSSProviderProps) {
  const getColor = (hue: string | number, lightness: string | number): string =>
    `hsl(${hue}deg, 80%, ${lightness}%)`;

  const cssVariables: React.CSSProperties = {
    // Brand colors
    '--chakra-colors-brand-50': getColor(hue, '97'),
    '--chakra-colors-brand-100': getColor(hue, '92'),
    '--chakra-colors-brand-200': getColor(hue, '85'),
    '--chakra-colors-brand-300': getColor(hue, '75'),
    '--chakra-colors-brand-400': getColor(hue, '65'),
    '--chakra-colors-brand-500': getColor(hue, '40'),
    '--chakra-colors-brand-600': getColor(hue, '32'),
    '--chakra-colors-brand-700': getColor(hue, '20'),
    '--chakra-colors-brand-800': getColor(hue, '12'),
    '--chakra-colors-brand-900': getColor(hue, '8'),

    // Gray colors
    '--chakra-colors-gray-50': 'rgb(250, 247, 245)',
    '--chakra-colors-gray-100': 'rgb(240, 235, 230)',
    '--chakra-colors-gray-200': 'rgb(228, 222, 218)',
    '--chakra-colors-gray-300': 'rgb(215, 210, 208)',
    '--chakra-colors-gray-400': 'rgb(205, 200, 195)',
    '--chakra-colors-gray-500': 'rgb(155, 148, 140)',
    '--chakra-colors-gray-600': 'rgb(88, 80, 75)',
    '--chakra-colors-gray-700': 'rgb(68, 60, 52)',
    '--chakra-colors-gray-800': 'rgb(48, 40, 32)',
    '--chakra-colors-gray-900': 'rgb(25, 20, 15)',

    // Green colors
    '--chakra-colors-green-50': '#F0FDF4',
    '--chakra-colors-green-100': '#DCFCE7',
    '--chakra-colors-green-200': '#BBF7D0',
    '--chakra-colors-green-300': '#86EFAC',
    '--chakra-colors-green-400': '#4ADE80',
    '--chakra-colors-green-500': '#22C55E',
    '--chakra-colors-green-600': '#16A34A',
    '--chakra-colors-green-700': '#15803D',
    '--chakra-colors-green-800': '#166534',
    '--chakra-colors-green-900': '#14532D',

    // Other colors
    '--chakra-colors-white': '#ffffff',
    '--chakra-colors-transparent': 'transparent',

    // Typography
    '--chakra-fontSizes-xs': '0.75rem',
    '--chakra-fontSizes-sm': '0.875rem',
    '--chakra-fontSizes-md': '1rem',
    '--chakra-fontSizes-lg': '1.125rem',
    '--chakra-fontSizes-xl': '1.25rem',
    '--chakra-fontSizes-2xl': '1.5rem',
    '--chakra-fontSizes-3xl': '1.875rem',
    '--chakra-fontSizes-4xl': '2.25rem',
    '--chakra-fontSizes-5xl': '3rem',
    '--chakra-fontSizes-6xl': '3.75rem',
    '--chakra-fontSizes-7xl': '4.5rem',
    '--chakra-fontSizes-8xl': '6rem',
    '--chakra-fontSizes-9xl': '8rem',

    // Spacing
    '--chakra-space-0': '0',
    '--chakra-space-1': '0.25rem',
    '--chakra-space-2': '0.5rem',
    '--chakra-space-3': '0.75rem',
    '--chakra-space-4': '1rem',
    '--chakra-space-5': '1.25rem',
    '--chakra-space-6': '1.5rem',
    '--chakra-space-8': '2rem',
    '--chakra-space-10': '2.5rem',
    '--chakra-space-12': '3rem',
    '--chakra-space-16': '4rem',
    '--chakra-space-20': '5rem',
    '--chakra-space-24': '6rem',
    '--chakra-space-32': '8rem',
    '--chakra-space-40': '10rem',
    '--chakra-space-48': '12rem',
    '--chakra-space-56': '14rem',
    '--chakra-space-64': '16rem',

    // Border radius
    '--chakra-radii-none': '0',
    '--chakra-radii-sm': '0.125rem',
    '--chakra-radii-base': '0.25rem',
    '--chakra-radii-md': '0.375rem',
    '--chakra-radii-lg': '0.5rem',
    '--chakra-radii-xl': '0.75rem',
    '--chakra-radii-2xl': '1rem',
    '--chakra-radii-3xl': '1.5rem',
    '--chakra-radii-full': '9999px',

    // Shadows
    '--chakra-shadows-xs': '0 0 0 1px rgba(0, 0, 0, 0.05)',
    '--chakra-shadows-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '--chakra-shadows-base':
      '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '--chakra-shadows-md':
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '--chakra-shadows-lg':
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '--chakra-shadows-xl':
      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '--chakra-shadows-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '--chakra-shadows-outline': '0 0 0 3px rgba(66, 153, 225, 0.6)',
    '--chakra-shadows-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

    // Z-index
    '--chakra-zIndices-hide': '-1',
    '--chakra-zIndices-auto': 'auto',
    '--chakra-zIndices-base': '0',
    '--chakra-zIndices-docked': '10',
    '--chakra-zIndices-dropdown': '1000',
    '--chakra-zIndices-sticky': '1100',
    '--chakra-zIndices-banner': '1200',
    '--chakra-zIndices-overlay': '1300',
    '--chakra-zIndices-modal': '1400',
    '--chakra-zIndices-popover': '1500',
    '--chakra-zIndices-skipLink': '1600',
    '--chakra-zIndices-toast': '1700',
    '--chakra-zIndices-tooltip': '1800',
  } as React.CSSProperties;

  return (
    <div style={cssVariables}>
      <style>
        {`
          /* Essential CSS Reset and Base Styles */
          *, *::before, *::after {
            box-sizing: border-box;
          }
          
          html {
            line-height: 1.15;
            -webkit-text-size-adjust: 100%;
          }
          
          body {
            margin: 0;
            font-family: 'Sarabun', sans-serif;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          /* Typography */
          h1, h2, h3, h4, h5, h6 {
            margin: 0;
            font-weight: 600;
            line-height: 1.2;
          }
          
          p {
            margin: 0 0 1rem 0;
          }
          
          /* Form elements */
          button, input, select, textarea {
            font-family: inherit;
            font-size: 100%;
            line-height: 1.15;
            margin: 0;
          }
          
          button {
            border: none;
            background: none;
            cursor: pointer;
          }
          
          /* Links */
          a {
            color: inherit;
            text-decoration: none;
          }
          
          /* Lists */
          ul, ol {
            margin: 0;
            padding: 0;
            list-style: none;
          }
          
          /* Images */
          img {
            max-width: 100%;
            height: auto;
            border-style: none;
          }
          
          /* Focus styles */
          :focus {
            outline: 2px solid var(--chakra-colors-brand-500);
            outline-offset: 2px;
          }
          
          /* Remove focus outline for mouse users */
          :focus:not(:focus-visible) {
            outline: none;
          }
        `}
      </style>
      {children}
    </div>
  );
}
