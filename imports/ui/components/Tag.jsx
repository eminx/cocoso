import React from 'react';
import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import { SmallCloseIcon } from '@chakra-ui/icons';

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
}) => {
  const getBackground = () => {
    if (gradientBackground) {
      return gradientBackground;
    } else if (filterColor) {
      return filterColor;
    } else if (checkable) {
      if (checked) {
        return filterColor;
      } else {
        return 'white';
      }
    } else {
      return 'teal.500';
    }
  };

  return (
    <Flex
      background={getBackground()}
      border={
        gradientBackground && checkable
          ? 'none'
          : `2px solid ${filterColor || '#484848'}`
      }
      borderRadius="2px"
      display="inline-block"
      p={gradientBackground && checkable ? '2px' : '0'}
      {...otherProps}
    >
      <Box
        background={checkable && checked ? 'none' : 'white'}
        border={!checkable ? 'none' : checked ? 'none' : 'white'}
        cursor="pointer"
        py="0"
        px="2"
        onClick={onClick}
      >
        <Text
          as="span"
          color={checked ? 'white' : filterColor}
          fontSize={otherProps.size || '14px'}
          fontWeight={checkable ? 'normal' : 'bold'}
        >
          {checkable ? label : label && label.toUpperCase()}
        </Text>
      </Box>
      {removable && (
        <IconButton icon={<SmallCloseIcon />} size="xs" onClick={onRemove} />
      )}
    </Flex>
  );
};

export default Tag;
