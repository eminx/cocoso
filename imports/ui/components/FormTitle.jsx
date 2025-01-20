import React, { useContext } from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { StateContext } from '../LayoutContainer';
import BackLink from './BackLink';
import parseHtml from 'html-react-parser';

export default function FormTitle({ context, isCalendar, isNew = false }) {
  const { currentHost } = useContext(StateContext);
  const [tc] = useTranslation('common');

  const menu = currentHost?.settings?.menu;
  let currentContext = menu?.find((item) => {
    if (isCalendar) {
      return item.name === 'calendar';
    }
    if (context === 'pages') {
      return item.name === 'info';
    }
    return item.name === context;
  });

  return (
    <Box data-oid="04tb74g">
      <Flex px="2" mb="2" data-oid="mh:n500">
        <BackLink
          backLink={{ label: currentContext?.label, value: '/' + currentContext?.name }}
          isSmall={false}
          data-oid="3os32vd"
        />
      </Flex>
      <Heading mb="4" size="lg" textAlign="center" data-oid="wm55h68">
        {isNew
          ? parseHtml(tc('labels.newFormEntry', { context: currentContext?.label }))
          : parseHtml(tc('labels.editFormEntry', { context: currentContext?.label }))}
      </Heading>
    </Box>
  );
}
