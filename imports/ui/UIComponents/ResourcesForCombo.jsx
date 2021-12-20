import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import Tag from './Tag';

function ResourcesForCombo({ resource }) {
  if (!resource) {
    return null;
  }
  const resourcesForCombo = resource.resourcesForCombo;
  const length = resource.resourcesForCombo.length;
  return (
    <span>
      {resource.label}
      <br />
      <Box py="1">
        <Tag label="COMBO" size="xsmall" />
      </Box>
      {' ['}
      {resourcesForCombo.map((res, i) => (
        <Text as="span" fontSize="sm" key={res._id}>
          {res.label + (i < length - 1 ? ' + ' : '')}
        </Text>
      ))}
      ]
    </span>
  );
}

export default ResourcesForCombo;
