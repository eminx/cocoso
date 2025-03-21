import React, { useContext } from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';

import { StateContext } from '../LayoutContainer';
import BackLink from '../entry/BackLink';

export default function FormTitle({ context, children }) {
  const { currentHost } = useContext(StateContext);

  const menu = currentHost?.settings?.menu;
  const currentContext = menu.find((item) => item.name === context);

  return (
    <Box>
      <Flex px="2" mb="2">
        <BackLink
          backLink={{ label: currentContext?.label, value: `/${currentContext?.name}` }}
          isSmall={false}
        />
      </Flex>
      <Heading mb="4" size="lg" textAlign="center">
        {children}
      </Heading>
    </Box>
  );
}
