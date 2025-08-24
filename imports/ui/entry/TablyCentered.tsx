import React, { useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import LinkIcon from 'lucide-react/dist/esm/icons/link';
import { Trans } from 'react-i18next';
import { Helmet } from 'react-helmet';

import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Link as CLink,
  Tag,
  VStack,
  Wrap,
} from '/imports/ui/core';

import NiceSlider from '../generic/NiceSlider';
import Tabs from '../core/Tabs';
import BackLink from './BackLink';

interface Author {
  username: string;
  src?: string;
}

interface AvatarHolderProps {
  author: Author | null;
}

interface HeaderProps {
  author?: Author | null;
  backLink?: string;
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
        <VStack align="center" justify="center" gap="0">
          <Avatar name={author.username} size="lg" src={author.src} />
          <CLink color="theme.500">{author.username}</CLink>
        </VStack>
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
  const location = useLocation();

  const handleCopyLink = async (): Promise<void> => {
    const host = window?.location?.host;
    await navigator.clipboard.writeText(`https://${host}${location.pathname}`);
    setCopied(true);
  };

  const renderTitles = () => (
    <Center>
      <Flex
        p="4"
        justify={author ? 'space-between' : 'center'}
        w="100%"
        maxW="720px"
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
            <Wrap justify={author ? 'flex-start' : 'center'} mt="2">
              {tags.map((tag, i) => (
                <Tag colorScheme="gray" key={tag + i}>
                  {tag}
                </Tag>
              ))}
            </Wrap>
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
  const location = useLocation();

  const pathnameLastPart = location.pathname.split('/').pop();
  const tabIndex =
    tabs && tabs.findIndex((tab) => tab.path === pathnameLastPart);

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

            {action && <Box>{action}</Box>}
          </Box>

          <Center mb="8" mt="4">
            <Box maxW="540px" w="100%">
              <Box w="100%">
                {tabs && (
                  <Box mt="2">
                    <Tabs justify="center" index={tabIndex ?? 0} tabs={tabs} />
                  </Box>
                )}

                <Box mb="24">
                  {tabs ? (
                    <Routes>
                      {tabs.map((tab) => (
                        <Route
                          key={tab.title}
                          path={tab.path}
                          element={<Box>{tab.content}</Box>}
                        />
                      ))}
                      <Route path="*" element={tabs[0].content} />
                    </Routes>
                  ) : (
                    <Box pt="2">{content}</Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Center>
        </Box>
      </Center>
    </>
  );
};

export default TablyCentered;
