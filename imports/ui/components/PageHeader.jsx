import React, { useState } from 'react';
import { Box, Center, Flex, Heading as CHeading, Divider, Text } from '@chakra-ui/react';

import NewButton from './NewButton';
import { Heading } from './Header';
import { StateContext } from '../LayoutContainer';

function PageHeader({ description, heading, numberOfItems, showNewButton = true, children }) {
  const { isDesktop } = useState(StateContext);

  return (
    <Center p="4">
      <Box>
        <Center wrap="wrap">
          {<Heading title={heading} numberOfItems={numberOfItems} textAlign="center" />}
          {/* {children} */}
        </Center>
        <Box pt="2" pb="2">
          <Divider borderColor="gray.500" />
          <CHeading
            size="sm"
            fontWeight="normal"
            lineHeight="1.5"
            maxW="520px"
            my="2"
            textAlign="center"
          >
            {description}
          </CHeading>
        </Box>
      </Box>
    </Center>
    // {showNewButton && <NewButton />}
  );
}

export default PageHeader;
