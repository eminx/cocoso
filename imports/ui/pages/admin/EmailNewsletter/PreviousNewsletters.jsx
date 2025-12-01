import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLoaderData } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';

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
      <Box pb="4">
        <Heading
          color="gray.800"
          fontFamily="'Raleway', sans-serif"
          mb="8"
          size="lg"
        >
          {tc('labels.newsletters')}
        </Heading>

        <NiceList
          actionsDisabled
          list={newsletters}
          keySelector="_id"
          spacing="0"
          bg="theme.50"
          p="8"
        >
          {(email) => {
            return (
              <Box>
                <Flex alignItems="flex-start" mb="4">
                  <Box>
                    <Link to={`/newsletters/${email._id}`}>
                      <CLink as="span">
                        <Heading size="md" mb="1">
                          {email.subject}
                        </Heading>
                      </CLink>
                    </Link>
                    <Box mb="1">
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
