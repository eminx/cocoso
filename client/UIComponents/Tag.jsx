import React from 'react';
import { Box, Button, Text } from 'grommet';
import { Close } from 'grommet-icons/icons/Close';

const Tag = ({
  label,
  onClick,
  removable = false,
  onRemove,
  background = 'accent-4',
  ...otherProps
}) => (
  <Box
    background={background}
    alignSelf="start"
    direction="row"
    align="center"
    round="2px"
    pad="2px 4px"
    gap="small"
    style={{ display: 'inline-block' }}
    {...otherProps}
  >
    <Box onClick={onClick}>
      <Text size={otherProps.size || '14px'} weight="bold" color="dark-1">
        {label && label.toUpperCase()}
      </Text>
    </Box>
    {removable && (
      <Button
        plain
        onClick={onRemove}
        icon={<Close color="dark-2" size="small" />}
      />
    )}
  </Box>
);

export default Tag;
