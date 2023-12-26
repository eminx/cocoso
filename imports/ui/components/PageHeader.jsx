import React, { useState } from 'react';
import { Box, Flex, Divider, Text } from '@chakra-ui/react';

import NewButton from './NewButton';
import { Heading } from './Header';
import { StateContext } from '../LayoutContainer';

function PageHeader({ description, heading, numberOfItems, showNewButton = true, children }) {
  const { isDesktop } = useState(StateContext);

  return (
    <Box mb="6" mt="4" px="4" maxW="780px">
      <Flex>
        <Flex align="center" justify="flex-start">
          <Box>
            <Flex wrap="wrap" mr="8">
              {<Heading title={heading} numberOfItems={numberOfItems} />}
              {children}
            </Flex>
            <Box pt="2" pr="2">
              <Divider borderColor="gray.500" maxW="690px" />
              <Text fontSize={isDesktop ? 'lg' : 'md'} fontWeight="light" mt="1">
                {description}
              </Text>
            </Box>
          </Box>
        </Flex>
        {showNewButton && <NewButton />}
      </Flex>
    </Box>
  );
}

export default PageHeader;
