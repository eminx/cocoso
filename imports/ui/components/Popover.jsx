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

export default function Popover({ footer, title, trigger, children, ...otherProps }) {
  return (
    <CPopover matchWidth trigger="hover" {...otherProps}>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent color="white" bg="gray.800" borderColor="gray.800">
        <PopoverArrow />
        <PopoverCloseButton />
        {title && <PopoverHeader>{title}</PopoverHeader>}
        <PopoverBody>{children}</PopoverBody>
        {footer && <PopoverFooter>{footer}</PopoverFooter>}
      </PopoverContent>
    </CPopover>
  );
}
