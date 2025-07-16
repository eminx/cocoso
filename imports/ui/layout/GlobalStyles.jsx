import React from 'react';
import { GlobalStyles as GlobalStylesRestyle } from 'restyle';

const getColor = (hue, lightness) =>
  `hsl(${hue}deg, 80%, ${lightness}%)`;

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
          body: {
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

            '--chakra-colors-brand-50': isGray
              ? 'rgb(250, 247, 245)'
              : getColor(hue, '97'),
            '--chakra-colors-brand-100': isGray
              ? 'rgb(240, 235, 230)'
              : getColor(hue, '92'),
            '--chakra-colors-brand-200': isGray
              ? 'rgb(228, 222, 218)'
              : getColor(hue, '86'),
            '--chakra-colors-brand-300': isGray
              ? 'rgb(125, 120, 115)'
              : getColor(hue, '80'),
            '--chakra-colors-brand-400': isGray
              ? 'rgb(105, 100, 95)'
              : getColor(hue, '72'),
            '--chakra-colors-brand-500': isGray
              ? 'rgb(88, 80, 75)'
              : getColor(hue, '40'),
            '--chakra-colors-brand-600': isGray
              ? 'rgb(78, 70, 65)'
              : getColor(hue, '32'),
            '--chakra-colors-brand-700': isGray
              ? 'rgb(68, 60, 52)'
              : getColor(hue, '20'),
            '--chakra-colors-brand-800': isGray
              ? 'rgb(48, 40, 32)'
              : getColor(hue, '12'),
            '--chakra-colors-brand-900': isGray
              ? 'rgb(25, 20, 15)'
              : getColor(hue, '8'),

            '--chakra-radii-md': theme?.body?.borderRadius || '0.25rem',

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

            '--cocoso-colors-bluegray-50': '#F8FAFC',
            '--cocoso-colors-bluegray-100': '#EEF4FD',
            '--cocoso-colors-bluegray-200': '#E1E9F8',
            '--cocoso-colors-bluegray-300': '#CDD5EA',
            '--cocoso-colors-bluegray-400': '#BEC9E4',
            '--cocoso-colors-bluegray-500': '#8F9BBA',
            '--cocoso-colors-bluegray-600': '#A3AED0',
            '--cocoso-colors-bluegray-700': '#707EAE',
            '--cocoso-colors-bluegray-800': '#505b81',
            '--cocoso-colors-bluegray-900': '#1B2559',

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

            '--cocoso-box-shadow':
              theme?.body?.boxShadow ||
              '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
          },
          '.cocoso-input': {
            width: '100%',
            borderRadius: 'var(--cocoso-border-radius, 0.375rem)',
            border: '2px solid var(--cocoso-colors-theme-200, #ccc)',
            background: 'white',
            color: 'var(--cocoso-colors-gray-900, #222)',
            outline: 'none',
            transition: 'border-color 0.2s',
          },
          '.cocoso-input--sm': {
            padding: '0.25rem 0.5rem',
            fontSize: '0.875rem',
          },
          '.cocoso-input--md': {
            padding: '0.5rem 1rem',
            fontSize: '1rem',
          },
          '.cocoso-input--lg': {
            padding: '0.75rem 1.25rem',
            fontSize: '1.125rem',
          },
          '.cocoso-input:hover': {
            borderColor: 'var(--cocoso-colors-theme-300, #3182ce)',
          },
          '.cocoso-input:focus': {
            borderColor: 'var(--cocoso-colors-theme-500, #3182ce)',
          },
          '.cocoso-input:active': {
            borderColor: 'var(--cocoso-colors-theme-500, #3182ce)',
          },
          '.cocoso-input[aria-invalid="true"]': {
            borderColor: 'var(--cocoso-colors-red-500, #e53e3e)',
          },
          '.cocoso-input:disabled': {
            opacity: 0.6,
            cursor: 'not-allowed',
            background: '#f5f5f5',
          },
          '.cocoso-textarea': {
            width: '100%',
            minHeight: '6rem',
            borderRadius: 'var(--cocoso-border-radius, 0.375rem)',
            border: '2px solid var(--cocoso-colors-theme-200, #ccc)',
            background: 'white',
            color: 'var(--cocoso-colors-gray-900, #222)',
            outline: 'none',
            transition: 'border-color 0.2s',
            fontFamily: 'inherit',
            resize: 'vertical',
            boxSizing: 'border-box',
          },
          '.cocoso-textarea--sm': {
            padding: '0.25rem 0.5rem',
            fontSize: '0.875rem',
          },
          '.cocoso-textarea--md': {
            padding: '0.5rem 1rem',
            fontSize: '1rem',
          },
          '.cocoso-textarea--lg': {
            padding: '0.75rem 1.25rem',
            fontSize: '1.125rem',
          },
          '.cocoso-textarea:hover': {
            borderColor: 'var(--cocoso-colors-theme-300, #3182ce)',
          },
          '.cocoso-textarea:focus': {
            borderColor: 'var(--cocoso-colors-theme-500, #3182ce)',
          },
          '.cocoso-textarea:active': {
            borderColor: 'var(--cocoso-colors-theme-500, #3182ce)',
          },
          '.cocoso-textarea[aria-invalid="true"]': {
            borderColor: 'var(--cocoso-colors-red-500, #e53e3e)',
          },
          '.cocoso-textarea:disabled': {
            opacity: 0.6,
            cursor: 'not-allowed',
            background: '#f5f5f5',
          },
          '.cocoso-select': {
            width: '100%',
            borderRadius: 'var(--cocoso-border-radius, 0.375rem)',
            border: '2px solid var(--cocoso-colors-theme-200, #ccc)',
            background: 'white',
            color: 'var(--cocoso-colors-gray-900, #222)',
            outline: 'none',
            transition: 'border-color 0.2s',
            appearance: 'none',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 8L10 11L13 8' stroke='%23666%27 stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '1.25em 1.25em',
            paddingRight: '2.5rem',
          },
          '.cocoso-select--sm': {
            padding: '0.25rem 2.5rem 0.25rem 0.5rem',
            fontSize: '0.875rem',
          },
          '.cocoso-select--md': {
            padding: '0.5rem 2.5rem 0.5rem 1rem',
            fontSize: '1rem',
          },
          '.cocoso-select--lg': {
            padding: '0.75rem 2.5rem 0.75rem 1.25rem',
            fontSize: '1.125rem',
          },
          '.cocoso-select:hover': {
            borderColor: 'var(--cocoso-colors-theme-300, #3182ce)',
          },
          '.cocoso-select:focus': {
            borderColor: 'var(--cocoso-colors-theme-500, #3182ce)',
          },
          '.cocoso-select:active': {
            borderColor: 'var(--cocoso-colors-theme-500, #3182ce)',
          },
          '.cocoso-select[aria-invalid="true"]': {
            borderColor: 'var(--cocoso-colors-red-500, #e53e3e)',
          },
          '.cocoso-select:disabled': {
            opacity: 0.6,
            cursor: 'not-allowed',
            background: '#f5f5f5',
          },

          '.cocoso-slide': {
            position: 'fixed',
            width: '100%',
            zIndex: 1000,
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform',
          },
          '.cocoso-slide-top': {
            top: '0',
            transform: 'translateY(-100%)',
          },
          '.cocoso-slide-top-ping': {
            transform: 'translateY(0)',
          },
          '.cocoso-slide-bottom': {
            bottom: '0',
            transform: 'translateY(100%)',
          },
          '.cocoso-slide-bottom-ping': {
            transform: 'translateY(0)',
          },
          '.cocoso-slide-left': {
            left: '0',
            transform: 'translateX(-100%)',
          },
          '.cocoso-slide-left-ping': {
            transform: 'translateX(0)',
          },
          '.cocoso-slide-right': {
            right: '0',
            transform: 'translateX(100%)',
          },
          '.cocoso-slide-right-ping': {
            transform: 'translateX(0)',
          },

          '.cocoso-fade': {
            opacity: 0,
            transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'opacity',
          },
          '.cocoso-fade-ping': {
            opacity: 1,
          },

          '.szh-menu': {
            borderRadius: 'var(--cocoso-border-radius)',
          },
        }}
      </GlobalStylesRestyle>
    </>
  );
}
