import React, { useContext } from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { StateContext } from '../LayoutContainer';
import BackLink from './BackLink';

export default function FormTitle({ context, isNew = false }) {
  const { currentHost, isDesktop } = useContext(StateContext);
  const [tc] = useTranslation('common');

  const menu = currentHost?.settings?.menu;
  let currentContext = menu?.find((item) => {
    if (context === 'pages') {
      return item.name === 'info';
    }
    return item.name === context;
  });

  return (
    <Box>
      <Flex px="2" mb="2">
        <BackLink
          backLink={{ label: currentContext?.label, value: '/' + context }}
          isSmall={false}
        />
      </Flex>
      <Heading mb="4" size="lg" textAlign="center">
        {isNew
          ? tc('labels.newFormEntry', { context: currentContext?.label })
          : tc('labels.editFormEntry', { context: currentContext?.label })}
      </Heading>
    </Box>
  );
}
