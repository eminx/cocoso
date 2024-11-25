import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

import { generateTheme } from '../../ui/utils/constants/theme';
import Header from './Header';

export default function WrapperSSR({
  Host,
  imageUrl,
  isEntryPage = false,
  subTitle,
  title,
  children,
}) {
  const hue = Host?.settings?.hue;
  const chakraTheme = generateTheme(hue || '233');

  return (
    <ChakraProvider theme={chakraTheme}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={subTitle?.substring(0, 150)} />
        <meta property="og:title" content={title?.substring(0, 30)} />
        <meta property="og:description" content={subTitle?.substring(0, 60)} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={Host.host} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;700&family=Sarabun:ital,wght@0,300;0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <Header Host={Host} isLogoSmall={isEntryPage} />

      {children}
    </ChakraProvider>
  );
}
