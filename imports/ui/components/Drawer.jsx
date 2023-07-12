import React, { useContext } from 'react';

import {
  Drawer as CDrawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { StateContext } from '../LayoutContainer';

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
  const { hue } = useContext(StateContext);
  const backgroundColor = hue ? `hsl(${hue}deg, 10%, 90%)` : 'gray.200';

  return (
    <CDrawer isOpen={isOpen} onClose={onClose} placement={placement} {...otherProps}>
      {!hideOverlay && <DrawerOverlay />}
      <DrawerContent bg={backgroundColor}>
        <DrawerCloseButton />
        {title && <DrawerHeader>{title}</DrawerHeader>}

        <DrawerBody>{children}</DrawerBody>

        {footer && <DrawerFooter>{footer}</DrawerFooter>}
      </DrawerContent>
    </CDrawer>
  );
}

export default Drawer;
