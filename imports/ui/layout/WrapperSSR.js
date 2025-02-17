import { Meteor } from 'meteor/meteor';
import React from 'react';
import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import { I18nextProvider } from 'react-i18next';

import generateTheme from '../utils/constants/theme';
import i18n from '../../startup/i18n';
import Header from './Header';
import HelmetHybrid from './HelmetHybrid';
import DummyWrapper from './DummyWrapper';
import { Footer } from './Footers';

export default function WrapperSSR({ Host, isEntryPage = false, children }) {
  if (!Host) {
    return null;
  }

  const pages = Meteor.call('getPageTitles');

  const pageTitles = pages.map((p) => p.title);

  const hue = Host?.settings?.hue;
  const chakraTheme = generateTheme(hue || '233');

  return (
    <>
      <HelmetHybrid Host={Host} />

      <I18nextProvider i18n={i18n}>
        <ChakraProvider theme={chakraTheme}>
          <ColorModeProvider>
            <DummyWrapper>
              <Header Host={Host} isLogoSmall={isEntryPage} pageTitles={pageTitles} />
              {children}
            </DummyWrapper>
            <Footer currentHost={Host} isFederationFooter />
          </ColorModeProvider>
        </ChakraProvider>
      </I18nextProvider>
    </>
  );
}
