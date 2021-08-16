import React from 'react';
import { Box, Button, Text } from 'grommet';
import { Close } from 'grommet-icons/icons/Close';

const Tag = ({
  label = '',
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
        ? gradientBackground
          ? gradientBackground
          : filterColor
        : gradientBackground || 'white'
    }
    alignSelf="start"
    direction="row"
    align="center"
    round="2px"
    gap="small"
    pad={gradientBackground && checkable ? '2px' : '0'}
    style={{
      border:
        gradientBackground && checkable
          ? 'none'
          : `2px solid ${filterColor || '#484848'}`,
    }}
    {...otherProps}
  >
    <Box
      onClick={onClick}
      focusIndicator={false}
      pad="2px 5px"
      style={{
        border: !checkable ? 'none' : checked ? 'none' : 'white',
        background: checkable && checked ? 'none' : 'white',
      }}
    >
      <Text
        size={otherProps.size || '14px'}
        weight={checkable ? 'normal' : 'bold'}
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
