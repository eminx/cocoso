import React from 'react';
import { GlobalStyles as GlobalStylesRestyle } from 'restyle';

const getColor = (hue, lightness) => `hsl(${hue}deg, 80%, ${lightness}%)`;

export default function GlobalStyles({ theme }) {
  const hue = theme?.hue || 220;
  const variant = theme?.variant;
  const isGray = variant === 'gray';

  return (
    <>
      <GlobalStylesRestyle>
        {{
          /* Usage:
            .cocoso-button, .cocoso-button--{size}, .cocoso-button--{variant}
            .cocoso-input, .cocoso-input--{size}
            colorScheme is handled by CSS variables (set on :root or body)
          */
          ':root': {
            '--cocoso-colors-theme-': 'white',
            '--cocoso-colors-theme-50': isGray
              ? 'rgb(250, 247, 245)'
              : getColor(hue, '97'),
            '--cocoso-colors-theme-100': isGray
              ? 'rgb(240, 235, 230)'
              : getColor(hue, '92'),
            '--cocoso-colors-theme-200': isGray
              ? 'rgb(228, 222, 218)'
              : getColor(hue, '85'),
            '--cocoso-colors-theme-300': isGray
              ? 'rgb(125, 120, 115)'
              : getColor(hue, '75'),
            '--cocoso-colors-theme-400': isGray
              ? 'rgb(105, 100, 95)'
              : getColor(hue, '65'),
            '--cocoso-colors-theme-500': isGray
              ? 'rgb(88, 80, 75)'
              : getColor(hue, '40'),
            '--cocoso-colors-theme-600': isGray
              ? 'rgb(78, 70, 65)'
              : getColor(hue, '32'),
            '--cocoso-colors-theme-700': isGray
              ? 'rgb(68, 60, 52)'
              : getColor(hue, '20'),
            '--cocoso-colors-theme-800': isGray
              ? 'rgb(48, 40, 32)'
              : getColor(hue, '12'),
            '--cocoso-colors-theme-900': isGray
              ? 'rgb(25, 20, 15)'
              : getColor(hue, '8'),

            '--cocoso-border-color': theme?.body?.borderColor,
            '--cocoso-border-radius': theme?.body?.borderRadius,
            '--cocoso-border-style': theme?.body?.borderStyle,
            '--cocoso-border-width': theme?.body?.borderWidth,

            '--cocoso-box-shadow':
              theme?.body?.boxShadow ||
              '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
          },
          body: {
            fontFamily: `${
              theme?.body?.fontFamily?.replace(/\+/g, ' ') || 'Raleway'
            }, sans-serif`,
          },
        }}
      </GlobalStylesRestyle>
    </>
  );
}
