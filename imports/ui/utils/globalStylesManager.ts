// Helper for hue-based colors
const getColor = (hue: number, lightness: string) =>
  `hsl(${hue}deg, 80%, ${lightness}%)`;

/**
 * Create a CSS string for the given theme.
 * Shared between SSR + client.
 */
export const getGlobalStylesForSSR = (theme: any): string => {
  const hue = theme?.hue || 220;
  const variant = theme?.variant;
  const isGray = variant === 'gray';
  const bodyFontDefinition = `${
    theme?.body?.fontFamily?.replace(/\+/g, ' ') || 'Raleway'
  }, sans-serif`;

  return `
    :root {
      --cocoso-colors-theme-: white;
      --cocoso-colors-theme-50: ${
        isGray ? 'rgb(250, 247, 245)' : getColor(hue, '97')
      };
      --cocoso-colors-theme-100: ${
        isGray ? 'rgb(240, 235, 230)' : getColor(hue, '92')
      };
      --cocoso-colors-theme-200: ${
        isGray ? 'rgb(228, 222, 218)' : getColor(hue, '85')
      };
      --cocoso-colors-theme-300: ${
        isGray ? 'rgb(125, 120, 115)' : getColor(hue, '75')
      };
      --cocoso-colors-theme-400: ${
        isGray ? 'rgb(105, 100, 95)' : getColor(hue, '65')
      };
      --cocoso-colors-theme-500: ${
        isGray ? 'rgb(88, 80, 75)' : getColor(hue, '40')
      };
      --cocoso-colors-theme-600: ${
        isGray ? 'rgb(78, 70, 65)' : getColor(hue, '32')
      };
      --cocoso-colors-theme-700: ${
        isGray ? 'rgb(68, 60, 52)' : getColor(hue, '20')
      };
      --cocoso-colors-theme-800: ${
        isGray ? 'rgb(48, 40, 32)' : getColor(hue, '12')
      };
      --cocoso-colors-theme-900: ${
        isGray ? 'rgb(25, 20, 15)' : getColor(hue, '8')
      };

      --cocoso-border-color: ${theme?.body?.borderColor || 'transparent'};
      --cocoso-border-radius: ${theme?.body?.borderRadius || '0'};
      --cocoso-border-style: ${theme?.body?.borderStyle || 'solid'};
      --cocoso-border-width: ${theme?.body?.borderWidth || '0px'};
      --cocoso-box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5),
                           1px 1px 3px rgba(0, 0, 0, 0.5);
      --cocoso-body-font-family: ${bodyFontDefinition};
    }

    body {
      font-family: ${bodyFontDefinition};
    }
  `;
};

/**
 * CLIENT-SIDE: inject or update the <style id="global-theme"> tag.
 */
export const applyGlobalStyles = (theme: any) => {
  if (typeof document === 'undefined') return; // SSR safety

  const css = getGlobalStylesForSSR(theme);

  let tag = document.getElementById('global-theme') as HTMLStyleElement | null;
  if (!tag) {
    tag = document.createElement('style');
    tag.id = 'global-theme';
    document.head.appendChild(tag);
  }

  // Always overwrite completely for deterministic reactivity
  tag.innerHTML = css;
};
