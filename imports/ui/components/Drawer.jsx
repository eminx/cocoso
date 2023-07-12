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
  footer,
  hideOverlay = false,
  placement = 'right',
  title,
  isOpen,
  onClose,
  ...otherProps
}) {
  return (
    <CDrawer isOpen={isOpen} onClose={onClose} placement={placement} {...otherProps}>
      {!hideOverlay && <DrawerOverlay />}
      <DrawerContent bg="brand.50">
        <DrawerCloseButton />
        {title && <DrawerHeader>{title}</DrawerHeader>}

        <DrawerBody>{children}</DrawerBody>

        {footer && <DrawerFooter>{footer}</DrawerFooter>}
      </DrawerContent>
    </CDrawer>
  );
}

export default Drawer;
