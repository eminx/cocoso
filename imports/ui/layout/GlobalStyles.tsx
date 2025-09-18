// imports/ui/GlobalStyles.tsx
import React, { useEffect } from 'react';
import { applyGlobalStyles } from '/imports/ui/utils/globalStylesManager';

export interface Theme {
  hue?: number | string;
  variant?: 'custom' | 'gray';
  body?: {
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundRepeat?: string;
    borderRadius?: string;
    fontFamily?: string;
  };
  menu?: {
    backgroundColor?: string;
    borderColor?: string;
    borderRadius?: string;
    borderStyle?: string;
    borderWidth?: string;
    color?: string;
    fontStyle?: string;
    textTransform?: string;
  };
}

interface GlobalStylesProps {
  theme: Theme;
}

export default function GlobalStyles({ theme }: GlobalStylesProps) {
  useEffect(() => {
    // Client-side only: apply styles after component mounts
    applyGlobalStyles(theme);
  }, [theme]);

  return null; // This component doesn't render anything
}
