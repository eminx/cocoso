import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Link,
} from '@chakra-ui/react';
import { Trans } from 'react-i18next';
import ReactPlayer from 'react-player';
import HTMLReactParser from 'html-react-parser';

import { getResponsiveGridColumns } from '/imports/ui/pages/composablepages/constants';
import { Heading } from '/imports/ui/core';
import EmblaSlider from '/imports/ui/generic/EmblaSlider';
import { StateContext } from '/imports/ui/LayoutContainer';

function ContentModule({ module }) {
  const { currentHost } = useContext(StateContext);
  if (!module || !module.value || !module.type) {
    return null;
  }

  const navigate = useNavigate();

  const { type, value } = module;
  const host = currentHost?.host;

  handleButtonClick = () => {
    if (!value.linkValue) {
      return;
    }
    if (value.linkValue.includes(host)) {
      const valueLink = value.linkValue.split(host)[1];
      navigate(valueLink);
    } else {
      window.open(value.linkValue, '_blank');
    }
  };

  switch (type) {
    case 'button':
      return (
        <Center py="4">
          <Button onClick={handleButtonClick}>{value.label}</Button>
        </Center>
      );
    case 'image':
      return (
        <Center py="4">
          <Image src={value.src} />
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
