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
  bodyProps,
  children,
  footer,
  headerProps,
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
    <CDrawer {...drawerProps} {...otherProps}>
      {!hideOverlay && <DrawerOverlay />}
      <DrawerContent bg={bg}>
        <DrawerCloseButton color={titleColor} />
        {title && (
          <DrawerHeader {...headerProps} color={titleColor}>
            {title}
          </DrawerHeader>
        )}

        <DrawerBody {...bodyProps}>{children}</DrawerBody>

        {footer && <DrawerFooter>{footer}</DrawerFooter>}
      </DrawerContent>
    </CDrawer>
  );
}

export default Drawer;
