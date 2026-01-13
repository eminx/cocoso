import React from 'react';
import loadable from '@loadable/component';
import { Link, useNavigate } from 'react-router';
import { Trans } from 'react-i18next';
import HTMLReactParser from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';
const ReactPlayer = loadable(() => import('react-player'));

import { Box, Button, Center, Flex, Grid, Image } from '/imports/ui/core';
import { Divider, Heading } from '/imports/ui/core';
import EmblaSlider from '/imports/ui/generic/EmblaSlider';

interface ModuleValue {
  label?: string;
  linkValue?: string;
  kind?: string;
  height?: number;
  imageUrl?: string;
  alt?: string;
  text?: string;
  video?: string;
  images?: string[];
  src?: string;
  html?: string;
}

interface Module {
  type?: string;
  value?: ModuleValue;
}

interface Host {
  host?: string;
  settings?: {
    menu?: Array<{
      name: string;
      label?: string;
    }>;
  };
}

interface ContentViewModuleProps {
  module: Module;
  Host: Host;
}

function ContentViewModule({ module, Host }: ContentViewModuleProps) {
  const currentHost = Host;
  if (!module || !module.value || !module.type) {
    return null;
  }

  const navigate = useNavigate();

  const { type, value } = module;
  const host = currentHost?.host;

  let buttonLink = type === 'button' ? value.linkValue : null,
    isButtonLinkExternal = true;
  if (buttonLink && buttonLink.includes(host)) {
    buttonLink = value.linkValue.split(host)[1];
    isButtonLinkExternal = false;
  }

  let imageLink = type === 'image' ? value.linkValue : null,
    isImageLinkExternal = true;
  if (imageLink && imageLink.includes(host)) {
    imageLink = value.linkValue.split(host)[1];
    isImageLinkExternal = false;
  }

  switch (type) {
    case 'button':
      return (
        <Center py="4">
          {isButtonLinkExternal ? (
            <a href={buttonLink}>
              <Button>{value.label}</Button>
            </a>
          ) : (
            <Link to={buttonLink}>
              <Button>{value.label}</Button>
            </Link>
          )}
        </Center>
      );
    case 'divider':
      if (value.kind === 'space') {
        return <Box w="100%" h={`${value.height}px`} />;
      }
      return <Divider />;
    case 'image':
      return (
        <Center py="4">
          {!value.isLink ? (
            <Image src={value.src} />
          ) : isImageLinkExternal ? (
            <a href={imageLink}>
              <Image src={value.src} />
            </a>
          ) : (
            <Link to={imageLink}>
              <Image src={value.src} />
            </Link>
          )}
        </Center>
      );
    case 'image-slider':
      return (
        <Center py="4">
          <EmblaSlider images={value.images} />
        </Center>
      );
    case 'text':
      return (
        <Center>
          <Box className="text-content" p="4" css={{ maxWidth: '480px' }}>
            {value.html
              ? HTMLReactParser(DOMPurify.sanitize(value.html))
              : null}
          </Box>
        </Center>
      );
    case 'video':
      return (
        <Box py="4">
          <ReactPlayer
            controls
            height="auto"
            muted
            style={{
              width: '100%',
              height: 'auto',
              aspectRatio: '16/9',
            }}
            url={value.src}
            width="100%"
          />
        </Box>
      );
    default:
      return null;
  }
}

interface ComposablePage {
  _id?: string;
  title?: string;
  modules?: Module[];
  settings?: {
    hideMenu?: boolean;
    hideTitle?: boolean;
  };
}

export interface ComposablePageHybridProps {
  Host: Host;
  composablePage: ComposablePage;
}

export default function ComposablePageHybrid({ Host, composablePage }: ComposablePageHybridProps) {
  if (!composablePage) {
    return null;
  }

  const hideMenu = composablePage.settings?.hideMenu;
  const hideTitle = composablePage.settings?.hideTitle;

  return (
    <Box mt="4">
      {hideMenu ? (
        <style>
          {`
            #main-menu {
              display: none;
            }
          `}
        </style>
      ) : null}
      {hideTitle ? null : (
        <Heading
          css={{ textAlign: 'center', margin: '1.5rem 0 0.5rem' }}
          size="xl"
        >
          {composablePage.title}
        </Heading>
      )}
      <Flex direction="column">
        {composablePage.contentRows.map((row, rowIndex) => (
          <Grid
            key={row.id || row.gridType + rowIndex}
            p="4"
            templateColumns="repeat(auto-fit, minmax(250px, 1fr))"
          >
            {row.columns.map((column, columnIndex) => (
              <Box key={columnIndex}>
                {column.map((module, moduleIndex) => (
                  <Box key={module.id || module.type + moduleIndex}>
                    <ContentViewModule module={module} Host={Host} />
                  </Box>
                ))}
              </Box>
            ))}
          </Grid>
        ))}
      </Flex>
    </Box>
  );
}
