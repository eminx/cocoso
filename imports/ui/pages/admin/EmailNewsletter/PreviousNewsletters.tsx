import React from 'react';
import { Link, Outlet, useLoaderData } from 'react-router';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  Link as CLink,
  Text,
} from '/imports/ui/core';
import NiceList from '/imports/ui/generic/NiceList';

export default function PreviousNewsletters() {
  const { newsletters } = useLoaderData();
  const [tc] = useTranslation('common');

  return (
    <Center>
      <Box pb="4" maxW="800px">
        <Center>
          <Heading
            color="gray.800"
            size="lg"
            css={{ marginBottom: '16px' }}
            textAlign="center"
          >
            {tc('labels.newsletters')}
          </Heading>
        </Center>

        <NiceList
          actionsDisabled
          list={newsletters}
          keySelector="_id"
          spacing="0"
          bg="white"
          p="8"
        >
          {(email) => {
            return (
              <Box>
                <Flex alignItems="flex-start" mb="4">
                  <Box>
                    <Link to={`/newsletters/${email._id}`}>
                      <CLink>
                        <Heading size="md">{email.subject}</Heading>
                      </CLink>
                    </Link>
                    <Box mb="1" mt="2">
                      <Text>{tc('labels.author')}: </Text>
                      <Text fontWeight="bold">{email.authorUsername}</Text>
                    </Box>
                    <Text color="gray.600" fontSize="sm">
                      {email.creationDate.toString()}
                    </Text>
                  </Box>
                </Flex>
                <Divider />
              </Box>
            );
          }}
        </NiceList>
      </Box>

      <Outlet />
    </Center>
  );
}
