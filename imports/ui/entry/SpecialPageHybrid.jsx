import React from 'react';
import { Box, Button, Center, Flex, Image } from '@chakra-ui/react';
import { Trans } from 'react-i18next';
import ReactPlayer from 'react-player';
import HTMLReactParser from 'html-react-parser';

import NiceSlider from '/imports/ui/generic/NiceSlider';
import { getResponsiveGridColumns } from '/imports/ui/pages/specialpages/constants';
import { Heading } from '/imports/ui/core';
import EmblaSlider from '/imports/ui/generic/EmblaSlider';

function ContentModule({ module }) {
  if (!module || !module.value || !module.type) {
    return null;
  }

  const { type, value } = module;

  switch (type) {
    case 'image':
      return (
        <Box py="2">
          <Image src={value.src} />
        </Box>
      );
    case 'image-slider':
      return (
        <Center py="2">
          <EmblaSlider images={value.images} />
        </Center>
      );
      return null;
      return (
        <Center py="2">
          <NiceSlider images={value.images} />
        </Center>
      );
    case 'button':
      return (
        <Box py="2">
          <Button>{value.label}</Button>
        </Box>
      );
    case 'text':
      return (
        <Box className="text-content" py="2">
          {value.html ? HTMLReactParser(value.html) : null}
        </Box>
      );
    case 'video':
      return (
        <Box py="2">
          <ReactPlayer
            controls
            height="auto"
            muted
            style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
            url={value.src}
            width="100%"
          />
        </Box>
      );
    default:
      return null;
  }
}

export default function SpecialPageHybrid({ specialPage, Host }) {
  if (!specialPage) {
    return null;
  }

  const thisSpecialPageInMenu = Host?.settings?.menu.find(
    (item) => item.name === specialPage.title
  );

  const url = `https://${specialPage.host}/sp/${specialPage.id}`;

  return (
    <Flex flexDirection="column">
      {specialPage.contentRows.map((row, rowIndex) => (
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
                  <ContentModule module={module} />
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      ))}
    </Flex>
  );
}
