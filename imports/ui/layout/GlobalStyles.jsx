import React from 'react';
import { GlobalStyles as GlobalStylesRestyle } from 'restyle';

const getColor = (hue, lightness) =>
  `hsl(${hue}deg, 80%, ${lightness}%)`;

export default function GlobalStyles({ theme }) {
  const hue = theme?.hue || 220;

  return (
    <GlobalStylesRestyle>
      {{
        body: {
          '--cocoso-colors-theme-50': getColor(hue, '97'),
          '--cocoso-colors-theme-100': getColor(hue, '92'),
          '--cocoso-colors-theme-200': getColor(hue, '85'),
          '--cocoso-colors-theme-300': getColor(hue, '75'),
          '--cocoso-colors-theme-400': getColor(hue, '65'),
          '--cocoso-colors-theme-500': getColor(hue, '40'),
          '--cocoso-colors-theme-600': getColor(hue, '32'),
          '--cocoso-colors-theme-700': getColor(hue, '20'),
          '--cocoso-colors-theme-800': getColor(hue, '12'),
          '--cocoso-colors-theme-900': getColor(hue, '8'),

          '--cocoso-colors-gray-50': 'rgb(250, 247, 245)',
          '--cocoso-colors-gray-100': 'rgb(240, 235, 230)',
          '--cocoso-colors-gray-200': 'rgb(228, 222, 218)',
          '--cocoso-colors-gray-300': 'rgb(215, 210, 208)',
          '--cocoso-colors-gray-400': 'rgb(205, 200, 195)',
          '--cocoso-colors-gray-500': 'rgb(155, 148, 140)',
          '--cocoso-colors-gray-600': 'rgb(88, 80, 75)',
          '--cocoso-colors-gray-700': 'rgb(68, 60, 52)',
          '--cocoso-colors-gray-800': 'rgb(48, 40, 32)',
          '--cocoso-colors-gray-900': 'rgb(25, 20, 15)',

          '--cocoso-colors-blueGray-50': '#F8FAFC',
          '--cocoso-colors-blueGray-100': '#EEF4FD',
          '--cocoso-colors-blueGray-200': '#E1E9F8',
          '--cocoso-colors-blueGray-300': '#CDD5EA',
          '--cocoso-colors-blueGray-400': '#BEC9E4',
          '--cocoso-colors-blueGray-500': '#8F9BBA',
          '--cocoso-colors-blueGray-600': '#A3AED0',
          '--cocoso-colors-blueGray-700': '#707EAE',
          '--cocoso-colors-blueGray-800': '#505b81',
          '--cocoso-colors-blueGray-900': '#1B2559',

          '--cocoso-colors-red-50': '#FEF2F2',
          '--cocoso-colors-red-100': '#FEE2E2',
          '--cocoso-colors-red-200': '#FECACA',
          '--cocoso-colors-red-300': '#FCA5A5',
          '--cocoso-colors-red-400': '#F87171',
          '--cocoso-colors-red-500': '#EF4444',
          '--cocoso-colors-red-600': '#DC2626',
          '--cocoso-colors-red-700': '#B91C1C',
          '--cocoso-colors-red-800': '#991B1B',
          '--cocoso-colors-red-900': '#7F1D1D',

          '--cocoso-colors-green-50': '#F0FDF4',
          '--cocoso-colors-green-100': '#DCFCE7',
          '--cocoso-colors-green-200': '#BBF7D0',
          '--cocoso-colors-green-300': '#86EFAC',
          '--cocoso-colors-green-400': '#4ADE80',
          '--cocoso-colors-green-500': '#22C55E',
          '--cocoso-colors-green-600': '#16A34A',
          '--cocoso-colors-green-700': '#15803D',
          '--cocoso-colors-green-800': '#166534',
          '--cocoso-colors-green-900': '#14532D',

          '--cocoso-border-color': theme?.body?.borderColor,
          '--cocoso-border-radius': theme?.body?.borderRadius,
          '--cocoso-border-style': theme?.body?.borderStyle,
          '--cocoso-border-width': theme?.body?.borderWidth,
        },
      }}
    </GlobalStylesRestyle>
  );
}
