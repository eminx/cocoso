import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Center, Flex, Image } from '@chakra-ui/react';
import { Trans } from 'react-i18next';
import ReactPlayer from 'react-player';
import HTMLReactParser from 'html-react-parser';

import { getResponsiveGridColumns } from '/imports/ui/pages/composablepages/constants';
import { Divider, Heading } from '/imports/ui/core';
import EmblaSlider from '/imports/ui/generic/EmblaSlider';
import { StateContext } from '/imports/ui/LayoutContainer';

function ContentModule({ module, Host }) {
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
              https://xyrden.s3-eu-central-1.amazonaws.com/emin/dup3.jpeg
              <Button as="span">{value.label}</Button>
            </Link>
          )}
        </Center>
      );
    case 'divider':
      if (value.kind === 'empty-space') {
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
          <Box className="text-content" maxW="480px" py="4">
            {value.html ? HTMLReactParser(value.html) : null}
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

export default function ComposablePageHybrid({ composablePage, Host }) {
  if (!composablePage) {
    return null;
  }

  const thisComposablePageInMenu = Host?.settings?.menu.find(
    (item) => item.name === composablePage.title
  );

  const url = `https://${composablePage.host}/sp/${composablePage.id}`;

  return (
    <>
      <Heading
        size="xl"
        css={{ textAlign: 'center', margin: '1rem 0' }}
      >
        {composablePage.title}
      </Heading>
      <Flex flexDirection="column">
        {composablePage.contentRows.map((row, rowIndex) => (
          <Box
            key={rowIndex}
            display="grid"
            gridTemplateColumns={getResponsiveGridColumns(row.gridType)}
            gap={{ base: 2, md: 4 }}
            p="4"
          >
            {row.columns.map((column, columnIndex) => (
              <Box key={columnIndex}>
                {column.map((module, moduleIndex) => (
                  <Box key={module.type + moduleIndex}>
                    <ContentModule module={module} Host={Host} />
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        ))}
      </Flex>
    </>
  );
}
