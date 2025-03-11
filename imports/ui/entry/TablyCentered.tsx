import React, { useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Link as CLink,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import LinkIcon from 'lucide-react/dist/esm/icons/link';
import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import { Trans } from 'react-i18next';
import { Helmet } from 'react-helmet';

import NiceSlider from '../generic/NiceSlider';
import Tabs from './Tabs';
import BackLink from './BackLink';

interface Author {
  username: string;
  src?: string;
}

interface AvatarHolderProps {
  author: Author | null;
}

interface HeaderProps {
  author: Author | null;
  backLink?: string;
  subTitle?: string;
  tags?: string[] | null;
  title: string;
}

interface AdminMenuItem {
  label: string;
  link?: string;
  onClick?: () => void;
}

interface AdminMenuProps {
  adminMenu: {
    label: string;
    items: AdminMenuItem[];
  } | null;
}

interface Tab {
  path: string;
  title: string;
  content: React.ReactNode;
}

interface TablyCenteredProps {
  action?: React.ReactNode;
  adminMenu?: {
    label: string;
    items: AdminMenuItem[];
  } | null;
  author?: Author | null;
  backLink?: string;
  content?: React.ReactNode;
  images?: string[];
  subTitle?: string;
  tabs?: Tab[];
  title: string;
  tags?: string[];
}

const AvatarHolder: React.FC<AvatarHolderProps> = ({ author }) => {
  if (!author) {
    return null;
  }
  return (
    <Box mt="2">
      <Link to={`/@${author.username}/`}>
        <VStack _hover={{ textDecoration: 'underline' }} justify="center" spacing="0">
          <Avatar borderRadius="lg" name={author.username} showBorder src={author.src} />
          <CLink as="span" color="brand.500">
            {author.username}
          </CLink>
        </VStack>
      </Link>
    </Box>
  );
};

const Header: React.FC<HeaderProps> = ({ author, backLink, subTitle, tags, title }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const location = useLocation();

  const handleCopyLink = async (): Promise<void> => {
    const host = window?.location?.host;
    await navigator.clipboard.writeText(`https://${host}${location.pathname}`);
    setCopied(true);
  };

  const renderTitles = () => (
    <Center>
      <Flex p="4" justify={author ? 'space-between' : 'center'} w="100%" maxW="720px">
        <Box px="2">
          <Heading
            as="h1"
            lineHeight={1}
            my="2"
            size="lg"
            textAlign={author ? 'left' : 'center'}
            textShadow="1px 1px 1px #fff"
          >
            {title}
          </Heading>
          {subTitle && (
            <Heading
              as="h2"
              size="md"
              fontWeight="400"
              lineHeight={1}
              my="2"
              textAlign={author ? 'left' : 'center'}
            >
              {subTitle}
            </Heading>
          )}
          {tags && tags.length > 0 && (
            <Wrap flexGrow="0" justify={author ? 'flex-start' : 'center'} mt="2">
              {tags.map((tag, i) => (
                <Badge
                  key={tag + i}
                  bg="gray.50"
                  borderRadius="lg"
                  color="gray.800"
                  fontSize="14px"
                  px="2"
                  py="1"
                  textTransform="capitalize"
                >
                  {tag}
                </Badge>
              ))}
            </Wrap>
          )}
        </Box>
        {author && <AvatarHolder author={author} />}
      </Flex>
    </Center>
  );

  return (
    <Box mb="4" w="100%">
      <Flex alignContent="flex-start" justify="space-between">
        <Box flexGrow={0} flexShrink={0} pl="2" width="150px">
          {backLink && <BackLink backLink={backLink} />}
        </Box>

        <Button
          color="blue.700"
          fontWeight="normal"
          leftIcon={<LinkIcon size={18} />}
          mr="4"
          variant="link"
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

const AdminMenu: React.FC<AdminMenuProps> = ({ adminMenu }) => {
  if (!adminMenu || !adminMenu.label || !adminMenu.items) {
    return null;
  }

  return (
    <Menu direction="rtl" placement="bottom-end">
      <MenuButton color="brand.500" fontSize="md" px="4" pb="2">
        <SettingsIcon />
      </MenuButton>
      <MenuList>
        {adminMenu.items.map((item) =>
          item.link ? (
            <Link key={item.label} to={item.link}>
              <MenuItem>{item.label}</MenuItem>
            </Link>
          ) : (
            <MenuItem key={item.label} onClick={item.onClick}>
              {item.label}
            </MenuItem>
          )
        )}
      </MenuList>
    </Menu>
  );
};

const TablyCentered: React.FC<TablyCenteredProps> = ({
  action = null,
  adminMenu = null,
  author = null,
  backLink,
  content,
  images,
  subTitle,
  tabs,
  title,
  tags,
}) => {
  const location = useLocation();

  const pathnameLastPart = location.pathname.split('/').pop();
  const tabIndex = tabs && tabs.findIndex((tab) => tab.path === pathnameLastPart);

  const description = subTitle || content?.toString() || author?.username;
  const imageUrl = images && images[0];

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description?.substring(0, 150)} />
        <meta property="og:title" content={title?.substring(0, 30)} />
        <meta property="og:description" content={description?.substring(0, 60)} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:type" content="article" />
      </Helmet>

      <Center w="100%">
        <Box w="100%">
          <Box>
            <Header
              author={author}
              backLink={backLink}
              subTitle={subTitle}
              tags={tags}
              title={title}
            />

            {images && (
              <Center py="2">
                <NiceSlider alt={title} images={images} />
              </Center>
            )}

            {action && <Box>{action}</Box>}
          </Box>

          <Center>
            <Box maxW="540px" w="100%">
              <Box w="100%">
                {tabs && (
                  <Tabs
                    align="center"
                    colorScheme="gray.800"
                    index={tabIndex}
                    mt="2"
                    mb="1"
                    tabs={tabs}
                  >
                    {adminMenu && <AdminMenu adminMenu={adminMenu} />}
                  </Tabs>
                )}

                <Box mb="24">
                  {tabs ? (
                    <Routes>
                      {tabs.map((tab) => (
                        <Route key={tab.title} path={tab.path} element={<Box>{tab.content}</Box>} />
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
