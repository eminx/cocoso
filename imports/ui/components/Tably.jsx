import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Grid,
  GridItem,
  Link as CLink,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import ChevronLeftIcon from 'lucide-react/dist/esm/icons/chevron-left';
import LinkIcon from 'lucide-react/dist/esm/icons/link';
import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import { useTranslation } from 'react-i18next';

import NiceSlider from './NiceSlider';
import { StateContext } from '../LayoutContainer';
import Tabs from './Tabs';

function Tably({
  action = null,
  adminMenu = null,
  author = null,
  backLink,
  content,
  images,
  subTitle,
  tabs,
  title,
  tags = null,
}) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentHost } = useContext(StateContext);
  const [tc] = useTranslation('common');

  useEffect(() => {
    setCopied(false);
  }, [location.pathname]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://${currentHost.host}${location.pathname}`);
      setCopied(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box>
        <Header
          author={author}
          backLink={backLink}
          copied={copied}
          subTitle={subTitle}
          tags={tags}
          tc={tc}
          title={title}
          handleCopyLink={handleCopyLink}
        />
        <Center>
          <NiceSlider alt={title} height="400px" images={images} isFade={false} />
        </Center>
        <Center mb="4" mx="4">
          {action}
        </Center>

        <Box bg="white" className="text-content" py="4">
          {content}
        </Box>
      </Box>
    </>
  );
}

function Header({ copied, isDesktop, subTitle, tags, tc, title, handleCopyLink }) {
  const fontFamily = "'Raleway', sans-serif";

  return (
    <Box mb="4">
      <Heading
        as="h1"
        fontFamily={fontFamily}
        fontSize="1.8em"
        lineHeight={1}
        mb="2"
        textAlign="center"
        textShadow="1px 1px 1px #fff"
      >
        {title}
      </Heading>
      {subTitle && (
        <Heading as="h2" fontSize="1.3em" fontWeight="light" lineHeight={1} textAlign="center">
          {subTitle}
        </Heading>
      )}
      {tags && tags.length > 0 && (
        <Flex flexGrow="0" justify="center">
          {tags.map(
            (tag) =>
              tag && (
                <Badge key={tag} bg="gray.50" color="gray.800" fontSize="14px">
                  {tag}
                </Badge>
              )
          )}
        </Flex>
      )}
    </Box>
  );
}

function AvatarHolder({ author, size = 'lg' }) {
  return (
    <Box pr="2">
      <VStack justify="center" spacing="0">
        <Avatar
          borderRadius="8px"
          elevation="medium"
          src={author?.src}
          name={author?.username}
          size={size}
        />
        {author?.link ? (
          <Link to={author?.link}>
            <CLink as="span" fontSize={size}>
              {author?.username}
            </CLink>
          </Link>
        ) : (
          <Text fontSize={size}>{author?.username}</Text>
        )}
      </VStack>
    </Box>
  );
}

export default Tably;
