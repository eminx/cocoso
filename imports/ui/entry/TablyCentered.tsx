import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import LinkIcon from 'lucide-react/dist/esm/icons/link';
import { Trans } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { useAtomValue } from 'jotai';

import { isMobileAtom } from '/imports/state';
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Link as CLink,
  Tag,
} from '/imports/ui/core';

import NiceSlider from '../generic/NiceSlider';
import Tabs from '../core/Tabs';
import BackLink, { BackLinkData } from './BackLink';

interface Author {
  username: string;
  src?: string;
}

interface AvatarHolderProps {
  author: Author | null;
}

interface HeaderProps {
  author?: Author | null;
  backLink?: BackLinkData;
  dates?: React.ReactNode;
  subTitle?: string;
  tags?: string[] | null;
  title: string;
}

interface Tab {
  path: string;
  title: string;
  content: React.ReactNode;
}

interface TablyCenteredProps extends HeaderProps {
  action?: React.ReactNode;
  content?: React.ReactNode;
  images?: string[];
  tabs?: Tab[];
  url?: string;
}

const AvatarHolder: React.FC<AvatarHolderProps> = ({ author }) => {
  if (!author) {
    return null;
  }
  return (
    <Box mt="2">
      <Link to={`/@${author.username}/`}>
        <Flex align="center" direction="column" justify="center" gap="0">
          <Avatar name={author.username} size="lg" src={author.src} />
          <CLink color="theme.500">{author.username}</CLink>
        </Flex>
      </Link>
    </Box>
  );
};

const Header: React.FC<HeaderProps> = ({
  author,
  backLink,
  dates,
  subTitle,
  tags,
  title,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyLink = async (): Promise<void> => {
    const href = window.location.href;
    await navigator.clipboard.writeText(href);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const renderTitles = () => (
    <Center>
      <Flex
        p="4"
        justify={author ? 'space-between' : 'center'}
        w="100%"
        css={{ maxWidth: '720px' }}
      >
        <Box px="2">
          <Heading
            size="lg"
            css={{
              lineHeight: 1,
              margin: '0.5rem 0',
              textAlign: author ? 'left' : 'center',
              textShadow: '1px 1px 1px #fff',
            }}
          >
            {title}
          </Heading>
          {subTitle && (
            <Heading
              size="sm"
              css={{
                lineHeight: 1,
                fontWeight: 'normal',
                margin: '0.5rem 0',
                textAlign: author ? 'left' : 'center',
                textShadow: '1px 1px 1px #fff',
              }}
            >
              {subTitle}
            </Heading>
          )}
          {tags && tags.length > 0 ? (
            <Flex justify={author ? 'flex-start' : 'center'} mt="2" wrap="wrap">
              {tags.map((tag, i) => (
                <Tag colorScheme="gray" key={tag + i}>
                  {tag}
                </Tag>
              ))}
            </Flex>
          ) : null}
          {dates ? <Center pt="2">{dates}</Center> : null}
        </Box>
        {author ? <AvatarHolder author={author} /> : null}
      </Flex>
    </Center>
  );

  return (
    <Box mb="4" w="100%">
      <Flex align="flex-start" justify="space-between">
        <Box pl="2" width="150px">
          {backLink && <BackLink backLink={backLink} />}
        </Box>

        <Button
          leftIcon={<LinkIcon />}
          size="lg"
          variant="ghost"
          css={{
            fontWeight: 'normal',
            marginRight: '1rem',
          }}
          onClick={() => handleCopyLink()}
        >
          {copied ? (
            <Trans i18nKey="actions.copied" ns="common">
              Link copied!
            </Trans>
          ) : (
            <Trans i18nKey="actions.share" ns="common">
              Share
            </Trans>
          )}
        </Button>
      </Flex>
      {renderTitles()}
    </Box>
  );
};

const TablyCentered: React.FC<TablyCenteredProps> = ({
  action = null,
  author = null,
  backLink,
  dates,
  content,
  images,
  subTitle,
  tabs,
  tags,
  title,
  url,
}) => {
  const [searchParams] = useSearchParams();
  const isMobile = useAtomValue(isMobileAtom);

  const selectedTabValue = searchParams.get('tab');
  let tabIndex = tabs?.findIndex((tab) => tab.path === selectedTabValue);
  tabIndex === -1 ? (tabIndex = 0) : null;
  const selectedTab = tabs?.find((tab, index) => index === tabIndex);

  const description = subTitle || content?.toString() || author?.username;
  const imageUrl = images && images[0];

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta name="tags" content={tags?.join(',')} />
        <meta property="og:title" content={title?.substring(0, 40)} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={imageUrl} />
        <meta
          property="og:description"
          content={description?.substring(0, 150)}
        />
        <meta property="og:type" content="article" />
      </Helmet>

      <Center w="100%">
        <Box w="100%">
          <Box>
            <Header
              author={author}
              backLink={backLink}
              dates={dates}
              subTitle={subTitle}
              tags={tags}
              title={title}
            />

            {images && (
              <Center>
                <NiceSlider alt={title} images={images} />
              </Center>
            )}

            {action && <Center>{action}</Center>}
          </Box>

          <Center mt="4">
            <Box w="100%" css={{ maxWidth: '540px' }}>
              {tabs && (
                <Box mt="2">
                  <Tabs
                    justify="center"
                    index={tabIndex ?? 0}
                    tabs={tabs}
                    withSearchParams
                  />
                </Box>
              )}

              <Box mb={isMobile ? '0' : '2'}>{selectedTab?.content}</Box>
            </Box>
          </Center>
        </Box>
      </Center>
    </>
  );
};

export default TablyCentered;
