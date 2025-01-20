import React from 'react';
import {
  Popover as CPopover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  //   PopoverAnchor,
} from '@chakra-ui/react';

export default function Popover({
  footer,
  isDark = true,
  title,
  triggerComponent,
  children,
  ...otherProps
}) {
  const bg = isDark ? 'gray.800' : 'gray.50';
  const borderColor = isDark ? 'gray.50' : 'gray.800';

  return (
    <CPopover trigger="hover" {...otherProps} data-oid="gbj:mf4">
      <PopoverTrigger data-oid="6b583yy">{triggerComponent}</PopoverTrigger>
      <PopoverContent
        bg={bg}
        borderColor={borderColor}
        color={isDark ? 'white' : 'gray.900'}
        maxW="95wv"
        py="4"
        w="auto"
        data-oid="twj9tbo"
      >
        <PopoverArrow bg={bg} data-oid="a_o7ptp" />
        <PopoverCloseButton mr="-1" data-oid="_w:_wts" />
        {title && <PopoverHeader data-oid="5chn0va">{title}</PopoverHeader>}
        <PopoverBody data-oid="0z3e9la">{children}</PopoverBody>
        {footer && <PopoverFooter data-oid="3u._im_">{footer}</PopoverFooter>}
      </PopoverContent>
    </CPopover>
  );
}
