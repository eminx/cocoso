import { Meteor } from 'meteor/meteor';
import React from 'react';
import { I18nextProvider } from 'react-i18next';

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

  return (
    <>
      <HelmetHybrid Host={Host} />

      <I18nextProvider i18n={i18n}>
        <DummyWrapper theme={Host?.theme}>
          <Header
            Host={Host}
            isLogoSmall={isEntryPage}
            pageTitles={pageTitles}
          />
          {children}
        </DummyWrapper>
        <Footer currentHost={Host} isFederationFooter />
      </I18nextProvider>
    </>
  );
}
