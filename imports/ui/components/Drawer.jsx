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
  bg = 'gray.100',
  children,
  footer,
  hideOverlay = false,
  placement = 'right',
  size = 'md',
  title,
  titleColor = 'gray.900',
  isOpen,
  onClose,
  ...otherProps
}) {
  const drawerProps = { isOpen, placement, size, onClose };

  return (
    <CDrawer {...drawerProps} {...otherProps} data-oid="ufhl3o9">
      {!hideOverlay && <DrawerOverlay data-oid="o4l3yxl" />}
      <DrawerContent bg={bg} data-oid="q:fakkn">
        <DrawerCloseButton color={titleColor} data-oid="po-ch5y" />
        {title && (
          <DrawerHeader color={titleColor} data-oid="5ayp.1e">
            {title}
          </DrawerHeader>
        )}

        <DrawerBody data-oid="w405md.">{children}</DrawerBody>

        {footer && <DrawerFooter data-oid="ss6fpsh">{footer}</DrawerFooter>}
      </DrawerContent>
    </CDrawer>
  );
}

export default Drawer;
