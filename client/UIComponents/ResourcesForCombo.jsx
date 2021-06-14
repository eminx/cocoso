import React from 'react';
import { Text } from 'grommet';

const ResourcesForCombo = ({ resource }) => {
  if (!resource) {
    return null;
  }
  const resourcesForCombo = resource.resourcesForCombo;
  const length = resource.resourcesForCombo.length;
  return (
    <span>
      {resource.label} [
      {resourcesForCombo.map((res, i) => (
        <Text key={res.label}>{res.label + (i < length - 1 ? ' + ' : '')}</Text>
      ))}
      ]
    </span>
  );
};

export default ResourcesForCombo;
