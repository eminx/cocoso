import React from 'react';
import { Link } from 'react-router';
import { Trans } from 'react-i18next';
import HTMLReactParser from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';
import { useAtomValue } from 'jotai';

import { platformAtom } from '/imports/state';
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

export interface OldFooterProps {
  host: string;
  settings: any;
}

export function OldFooter({ host, settings }: OldFooterProps) {
  return (
    <Box
      p="4"
      css={{
        fontSize: '85%',
        lineHeight: '2',
        textAlign: 'center',
      }}
    >
      <Text color="gray.100" size="sm">
        {settings?.address}
        {', '} {settings?.city}
      </Text>
      <br />
      <Text color="gray.100" fontSize="sm">
        {settings?.email}
      </Text>
      <br />
      <Text color="gray.100" fontSize="sm" fontWeight="bold">
        {host}
      </Text>
    </Box>
  );
}

export interface FooterProps {
  currentHost: any;
}

export function Footer({ currentHost }: FooterProps) {
  const platform = useAtomValue(platformAtom);

  if (!platform || !currentHost || !currentHost.settings) {
    return null;
  }

  const { settings } = currentHost;
  const isFederationFooter = platform?.isFederationLayout && platform.footer;
  const activeMenu = currentHost.settings?.menu?.filter(
    (item) => item.isVisible
  );

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
                <Text color="theme.50">{item.label}</Text>{' '}
              </Link>
            </Box>
          ))}
        </Flex>
      </Center>

      {!currentHost.isPortalHost && (
        <Center pt="2">
          <Flex
            direction="column"
            justify="center"
            css={{
              textAlign: 'center',
            }}
          >
            <Center>
              <Heading size="md">{settings.name}</Heading>
            </Center>
            <Center>
              {settings.footer ? (
                <Box
                  className="text-content dark"
                  mt="4"
                  w="100%"
                  css={{
                    fontSize: '85%',
                    textAlign: 'center',
                    maxWidth: '480px',
                  }}
                >
                  {HTMLReactParser(DOMPurify.sanitize(settings.footer))}
                </Box>
              ) : (
                <OldFooter host={currentHost.host} settings={settings} />
              )}
            </Center>
            {!isFederationFooter && (
              <>
                <Center>
                  <Link to="/terms-&-privacy-policy">
                    <Text color="blue.100" fontSize="xs">
                      <Trans i18nKey="common:terms.title">
                        Terms of Service & Privacy Policy
                      </Trans>
                    </Text>
                  </Link>
                </Center>
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

export function PlatformFooter() {
  const platform = useAtomValue(platformAtom);

  if (!platform || !platform.isFederationLayout || !platform.footer) {
    return null;
  }

  return (
    <Center bg="gray.900" className="platform-footer">
      <Box
        color="white"
        py="4"
        css={{
          fontSize: '85%',
          maxWidth: '480px',
          textAlign: 'center',
        }}
      >
        <Box p="4">
          <a href={`https://${platform?.portalHost}`}>
            <Heading color="white" size="md" textAlign="center">
              {platform.name}
            </Heading>
          </a>
        </Box>

        <Box p="2" className="text-content">
          {HTMLReactParser(DOMPurify.sanitize(platform.footer))}
        </Box>

        <Center>
          <Link to="/terms-&-privacy-policy">
            <Text
              color="theme.50"
              fontSize="xs"
              css={{
                textAlign: 'center',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              <Trans i18nKey="common:terms.title">
                Terms of Service & Privacy Policy
              </Trans>
            </Text>
          </Link>
        </Center>
        <FeedbackForm isDarkText={false} />
      </Box>
    </Center>
  );
}
