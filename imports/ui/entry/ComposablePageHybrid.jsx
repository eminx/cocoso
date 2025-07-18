import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trans } from 'react-i18next';
import ReactPlayer from 'react-player';
import HTMLReactParser from 'html-react-parser';
import { GlobalStyles } from 'restyle';

import { Box, Button, Center, Flex, Grid, Image } from '/imports/ui/core';
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

  const hideMenu = composablePage.settings?.hideMenu;
  const hideTitle = composablePage.settings?.hideTitle;

  return (
    <Box mt="4">
      {hideMenu ? (
        <GlobalStyles>
          {{
            '.main-menu': {
              display: 'none',
            },
          }}
        </GlobalStyles>
      ) : null}
      {hideTitle ? null : (
        <Heading
          css={{ textAlign: 'center', margin: '1.5rem 0 0.5rem' }}
          size="xl"
        >
          {composablePage.title}
        </Heading>
      )}
      <Flex flexDirection="column">
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
                    <ContentModule module={module} Host={Host} />
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
