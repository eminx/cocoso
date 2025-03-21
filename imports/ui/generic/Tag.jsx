import React from 'react';
import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import SmallCloseIcon from 'lucide-react/dist/esm/icons/x-circle';

function Tag({
  label = '',
  gradientBackground = null,
  filterColor = '#2d2d2d',
  checkable = false,
  checked = false,
  removable = false,
  onClick,
  onRemove,
  ...otherProps
}) {
  const getBackground = () => {
    if (gradientBackground) {
      return gradientBackground;
    } else if (filterColor) {
      return filterColor;
    } else if (checkable) {
      if (checked) {
        return filterColor;
      }
      return 'white';
    }
    return 'teal.500';
  };

  return (
    <Flex
      background={getBackground()}
      border={gradientBackground && checkable ? 'none' : `1px solid ${filterColor || '#484848'}`}
      borderRadius="lg"
      display="inline-flex"
      p={gradientBackground && checkable ? '2px' : '0'}
      {...otherProps}
    >
      <Box
        bg={checkable && checked ? 'none' : 'white'}
        border={checkable && !checked ? 'white' : 'none'}
        borderRadius="lg"
        cursor="pointer"
        px="2"
        pb="1px"
        onClick={onClick}
      >
        <Text
          as="span"
          color={checked ? 'white' : filterColor}
          fontSize="sm"
          textTransform="capitalize"
        >
          {label}
        </Text>
      </Box>
      {removable && <IconButton icon={<SmallCloseIcon />} size="xs" onClick={onRemove} />}
    </Flex>
  );
}

export default Tag;
