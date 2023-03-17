import React, { useState } from 'react';
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
import { useTranslation } from 'react-i18next';

export default function PortalHostIndicator({ platform }) {
  const { t } = useTranslation('hosts');

  return (
    <Box bg="gray.100">
      <Accordion allowToggle>
        <AccordionItem border="none">
          <AccordionButton
            borderWidth="0"
            display="flex"
            justifyContent="center"
            p="1"
            w="100%"
            _expanded={{ bg: 'gray.600', color: 'gray.50' }}
          >
            <Center>
              <Flex alignItems="center">
                <Text fontWeight="bold" mr="2">
                  {t('portalHost.indicatorShortText', { platform: platform?.name })}
                </Text>
                <InfoOutlineIcon />
              </Flex>
            </Center>
          </AccordionButton>
          <AccordionPanel bg="gray.700" color="gray.50" pb={4}>
            <Center>
              <Container>
                <Text fontSize="sm" textAlign="center">
                  {t('portalHost.indicatorLongText', { platform: platform?.name })}
                </Text>
              </Container>
            </Center>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}
