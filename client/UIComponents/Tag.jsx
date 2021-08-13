import React from 'react';
import { Box, Button, Text } from 'grommet';
import { Close } from 'grommet-icons/icons/Close';

const Tag = ({
  label = '',
  background = 'accent-4',
  gradientBackground = null,
  filterColor,
  checkable = false,
  checked = false,
  removable = false,
  onClick,
  onRemove,
  ...otherProps
}) => (
  <Box
    background={
      !checkable
        ? 'accent-4'
        : checked
        ? gradientBackground || filterColor
        : 'white'
    }
    alignSelf="start"
    direction="row"
    align="center"
    round="2px"
    gap="small"
    {...otherProps}
  >
    <Box
      onClick={onClick}
      focusIndicator={false}
      pad="1px 4px"
      style={{
        border: checkable ? `2px solid ${filterColor}` : 'none',
      }}
    >
      <Text
        size={otherProps.size || '14px'}
        weight="bold"
        color={checked ? 'white' : filterColor}
      >
        {checkable ? label : label.toUpperCase()}
      </Text>
    </Box>
    {removable && (
      <Button
        plain
        icon={<Close color="dark-2" size="small" />}
        margin={{ right: '4px' }}
        onClick={onRemove}
      />
    )}
  </Box>
);

export default Tag;
