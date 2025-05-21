import React, { useContext, useEffect, useState } from 'react';
import { Button, Flex, Text } from '@chakra-ui/react';

import { SpecialPageContext } from '../SpecialPageForm';

export default function BottomToolbar() {
  const [updated, setUpdated] = useState(false);
  const { currentPage, setCurrentPage } = useContext(SpecialPageContext);

  useEffect(() => {
    if (currentPage.ping === false) {
      setUpdated(true);
    }
    setTimeout(() => {
      setUpdated(false);
    }, 3000);
  }, [currentPage?.ping]);

  let updatedClassName = 'bottom-toolbar ';
  if (updated) {
    updatedClassName += 'updated';
  }

  if (!currentPage) {
    return null;
  }

  return (
    <Flex bg="gray.900" bottom="12px" justify="space-between" position="fixed" p="2">
      <Text className={updatedClassName} fontSize="sm" fontWeight="bold" mx="4" mt="4px">
        Saved
      </Text>
      <Button
        _active={{ bg: 'gray.700' }}
        _hover={{ bg: 'gray.700' }}
        color="blue.200"
        mx="4"
        size="sm"
        variant="ghost"
      >
        Preview
      </Button>
      <Button colorScheme="blue" mx="4" size="sm" variant="solid">
        Publish
      </Button>
    </Flex>
  );
}
