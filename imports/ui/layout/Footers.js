import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HTMLReactParser from 'html-react-parser';

import {
  Box,
  Center,
  Flex,
  Heading,
  Link as CLink,
  Text,
} from '/imports/ui/core';

import FeedbackForm from './FeedbackForm';
import ChangeLanguageMenu from './ChangeLanguageMenu';

export function OldFooter({ host, settings }) {
  return (
    <Box textAlign="center" p="4" fontSize="85%">
      <Text fontSize="sm">
        {settings?.address}
        {', '} {settings?.city}
      </Text>
      <Text fontSize="sm">{settings?.email}</Text>
      <Text fontSize="sm" fontWeight="bold">
        {host}
      </Text>
    </Box>
  );
}

export function Footer({ currentHost, isFederationFooter }) {
  const [tc] = useTranslation('common');
  if (!currentHost || !currentHost.settings) {
    return null;
  }

  const activeMenu = currentHost.settings?.menu?.filter(
    (item) => item.isVisible
  );
  const { settings } = currentHost;

  return (
    <Box bg="gray.700" bottom={0} color="gray.100">
      <Center p="4">
        <Flex wrap="wrap" justify="center">
          {activeMenu.map((item) => (
            <Box key={item.name} p="2">
              <Link
                to={
                  item.name === 'info'
                    ? '/info/about'
                    : item.isComposablePage
                    ? `/cp/${item.name}`
                    : `/${item.name}`
                }
              >
                <CLink as="span">{item.label}</CLink>{' '}
              </Link>
            </Box>
          ))}
        </Flex>
      </Center>

      {!currentHost.isPortalHost && (
        <Center pt="2">
          <Flex direction="column" justify="center" textAlign="center">
            <Heading size="md">{settings.name}</Heading>
            <Center>
              {settings.footer ? (
                <Box
                  className="text-content dark"
                  fontSize="85%"
                  maxWidth="480px"
                  mt="4"
                  textAlign="center"
                  w="100%"
                >
                  {HTMLReactParser(settings?.footer)}
                </Box>
              ) : (
                <OldFooter host={currentHost.host} settings={settings} />
              )}
            </Center>
            {!isFederationFooter && (
              <>
                <Box>
                  <Link to="/terms-&-privacy-policy">
                    <CLink as="span" fontSize="xs">
                      {tc('terms.title')}{' '}
                    </CLink>
                  </Link>
                </Box>
                <FeedbackForm />
              </>
            )}
          </Flex>
        </Center>
      )}
      <Center p="4">
        <ChangeLanguageMenu centered />
      </Center>
    </Box>
  );
}

export function PlatformFooter({ platform, children }) {
  const [tc] = useTranslation('common');
  if (!platform) {
    return null;
  }
  return (
    <Center bg="gray.900" className="platform-footer">
      <Box color="white" fontSize="85%" maxW="480px" py="4" textAlign="center">
        <Box p="4">
          <a href={`https://${platform?.portalHost}`}>
            <Heading color="white" size="md">
              {platform.name}
            </Heading>
          </a>
        </Box>

        <Box p="2" className="text-content">
          {HTMLReactParser(platform.footer)}
        </Box>
        <Box p="2">{children}</Box>

        <Box>
          <Link to="/terms-&-privacy-policy">
            <CLink as="span" color="brand.50" fontSize="xs">
              {tc('terms.title')}{' '}
            </CLink>
          </Link>
        </Box>
        <FeedbackForm isDarkText={false} />
      </Box>
    </Center>
  );
}
