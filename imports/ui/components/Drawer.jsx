import React from 'react';

import {
  Drawer as CDrawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';

function Drawer({
  children,
  content,
  footer,
  placement = 'right',
  title,
  isOpen,
  onClose,
  ...otherProps
}) {
  return (
    <CDrawer isOpen={isOpen} onClose={onClose} placement={placement} {...otherProps}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{title}</DrawerHeader>

        <DrawerBody>{children}</DrawerBody>

        <DrawerFooter>{footer}</DrawerFooter>
        </DrawerContent>
      </CDrawer>
  );
}

export default Drawer;
