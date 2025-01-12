import React from 'react';
import { Box, ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import { I18nextProvider, useSSR } from 'react-i18next';

import { generateTheme } from '/imports/ui/utils/constants/theme';
import i18n from '/imports/startup/i18n';
import Header from './Header';
import HelmetHybrid from './HelmetHybrid';

export default function WrapperSSR({ Host, isEntryPage = false, children }) {
  if (!Host) {
    return null;
  }

  const hue = Host?.settings?.hue;
  const chakraTheme = generateTheme(hue || '233');

  return (
    <>
      <HelmetHybrid Host={Host} />

      <I18nextProvider i18n={i18n}>
        <ChakraProvider theme={chakraTheme}>
          <ColorModeProvider>
            <Box bg="gray.100" minH="1800px">
              <Header Host={Host} />
              {children}
            </Box>
          </ColorModeProvider>
        </ChakraProvider>
      </I18nextProvider>
    </>
  );
}
