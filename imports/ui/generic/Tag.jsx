import React from 'react';
import SmallCloseIcon from 'lucide-react/dist/esm/icons/x-circle';

import { Box, Flex, IconButton } from '/imports/ui/core';

function Tag({
  label = '',
  gradientBackground = null,
  filterColor,
  checkable = false,
  checked = false,
  removable = false,
  onClick,
  onRemove,
}) {
  console.log(filterColor);
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
    return 'var(--cocoso-colors-gray-50)';
  };

  return (
    <Flex
      align="center"
      gap="0"
      css={{
        background: getBackground(),
        borderRadius: 'var(--cocoso-border-radius)',
        border:
          gradientBackground && checkable
            ? 'none'
            : `1px solid ${filterColor || '#484848'}`,
        display: 'inline-flex',
        padding: gradientBackground && checkable ? '2px' : '0',
      }}
    >
      <Box
        css={{
          backgroundColor: checkable && checked ? 'none' : 'white',
          border: checkable && !checked ? 'white' : 'none',
          borderRadius: 'var(--cocoso-border-radius)',
          cursor: 'pointer',
          padding: '0 0.5rem 1px',
        }}
        onClick={onClick}
      >
        <span
          style={{
            fontSize: '0.875rem',
            color: checked ? 'white' : filterColor,
            textTransform: 'capitalize',
          }}
        >
          {label}
        </span>
      </Box>
      {removable && (
        <IconButton icon={<SmallCloseIcon />} size="xs" onClick={onRemove} />
      )}
    </Flex>
  );
}

export default Tag;
