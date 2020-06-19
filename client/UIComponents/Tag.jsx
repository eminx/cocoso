import React from 'react';
import { Box, Button, Text } from 'grommet';
import { Close } from 'grommet-icons';

const Tag = ({
  label,
  onClick,
  removable = false,
  onRemove,
  ...otherProps
}) => (
  <Box
    background="accent-4"
    alignSelf="start"
    direction="row"
    align="center"
    round
    pad={{ top: 'xsmall', bottom: 'xsmall', right: 'small', left: 'small' }}
    margin={{ top: 'small', right: 'small' }}
    gap="small"
    {...otherProps}
  >
    <Box onClick={onClick}>
      <Text size="xsmall" weight="bold">
        {label}
      </Text>
    </Box>
    {removable && (
      <Button plain onClick={onRemove} icon={<Close size="xsmall" />} />
    )}
  </Box>
);

export default Tag;
