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
  bg = 'brand.200',
  children,
  footer,
  hideOverlay = false,
  placement = 'right',
  title,
  titleColor = 'gray.900',
  isOpen,
  onClose,
  ...otherProps
}) {
  return (
    <CDrawer isOpen={isOpen} onClose={onClose} placement={placement} {...otherProps}>
      {!hideOverlay && <DrawerOverlay />}
      <DrawerContent bg={bg}>
        <DrawerCloseButton />
        {title && <DrawerHeader color={titleColor}>{title}</DrawerHeader>}

        <DrawerBody>{children}</DrawerBody>

        {footer && <DrawerFooter>{footer}</DrawerFooter>}
      </DrawerContent>
    </CDrawer>
  );
}

export default Drawer;
