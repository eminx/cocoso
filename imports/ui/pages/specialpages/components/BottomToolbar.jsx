import React, { useContext, useEffect, useState } from 'react';
import { Button, Flex, Link, Text } from '@chakra-ui/react';

import { SpecialPageContext } from '../SpecialPageForm';
import ExternalLinkIcon from 'lucide-react/dist/esm/icons/external-link';
import { CheckIcon } from 'lucide-react';

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
    <Flex
      bg="gray.900"
      borderRadius="md"
      bottom="12px"
      boxShadow="md"
      justify="space-between"
      position="fixed"
      p="2"
    >
      <Flex align="center" color="green.200" mx="4">
        {updated ? <CheckIcon size="16" /> : null}
        <Text className={updatedClassName} fontSize="sm" fontWeight="bold" ml="1">
          Saved
        </Text>
      </Flex>
      <Flex align="center" color="blue.200" mx="2">
        <Link
          color="blue.200"
          fontSize="sm"
          fontWeight="bold"
          href={`http://${currentPage.host}/sp/${currentPage._id}`}
          mr="1"
          target="_blank"
        >
          Preview
        </Link>
        <ExternalLinkIcon size="16" />
      </Flex>
      <Button colorScheme="blue" mx="4" size="sm" variant="solid">
        Publish
      </Button>
    </Flex>
  );
}
