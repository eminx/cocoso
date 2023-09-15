import React from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  Container,
  Flex,
  Text,
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import renderHTML from 'react-render-html';

export default function PortalHostIndicator({ platform }) {
  const { topbar } = platform;

  return (
    <Box bg="brand.800">
      <Accordion allowToggle>
        <AccordionItem border="none">
          <AccordionButton
            borderWidth="0"
            color="gray.50"
            display="flex"
            justifyContent="center"
            p="1"
            w="100%"
            _hover={{ bg: 'brand.600' }}
            _expanded={{ bg: 'brand.50', color: 'hsl(300deg 20% 20%)' }}
          >
            <Center>
              <Flex alignItems="center">
                <Text fontWeight="bold" mr="2">
                  {topbar?.closed}
                </Text>
                <InfoOutlineIcon />
              </Flex>
            </Center>
          </AccordionButton>
          <AccordionPanel bg="brand.50" color="hsl(300deg 20% 20%)" pb={4}>
            <Center>
              {topbar.open && (
                <Container fontSize="sm" textAlign="center">
                  {renderHTML(topbar.open)}
                </Container>
              )}
            </Center>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}
