import React from 'react';
import { Box, Button, Flex, Link, Img } from '@chakra-ui/react';
import { Trans } from 'react-i18next';
import ReactPlayer from 'react-player';

import NiceSlider from '/imports/ui/generic/NiceSlider';
import HTMLReactParser from 'html-react-parser';
import { getGridTemplateColumns } from '/imports/ui/pages/specialpages/constants';
import { Heading, Image } from '/imports/ui/core';

function renderModule(module) {
  if (!module || !module.value || !module.type) {
    return null;
  }

  const { type, value } = module;

  switch (type) {
    case 'image':
      return <Image src={value.src} alt={value.alt} />;
    case 'image-slider':
      return <NiceSlider images={value.images} />;
    case 'image-with-button':
      return <Img src={value.imageSrc} alt={value.altText} />;
    case 'link':
      return <Link href={value.href}>{value.label}</Link>;
    case 'text':
      return <Box className="text-content">{value.html ? HTMLReactParser(value.html) : null}</Box>;
    case 'video':
      return <ReactPlayer controls src={value.src} />;
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
          gridTemplateColumns={getGridTemplateColumns(row.gridType)}
        >
          {row.columns.map((column, columnIndex) => (
            <Box key={columnIndex}>
              {column.map((module, moduleIndex) => (
                <Box key={module.type + moduleIndex} p="6">
                  {renderModule(module)}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      ))}
    </Flex>
  );
}
