import React, { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { styled } from '@stitches/react';

import { Box, Button } from '/imports/ui/core';

// Common props interface
interface BaseProps {
  cancelButtonProps?: object;
  cancelText?: string;
  children: React.ReactNode;
  closeOnOverlayClick?: boolean;
  confirmButtonProps?: object;
  confirmText?: string;
  hideFooter?: boolean;
  hideHeader?: boolean;
  id: string;
  noPadding?: boolean;
  onCancel?: () => void;
  onClose: () => void;
  onConfirm?: () => void;
  onSecondaryButtonClick?: () => void;
  open: boolean;
  title?: string;
}

// Drawer-specific props
interface DrawerProps extends BaseProps {
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  styles?: any;
}

// Modal-specific props
interface ModalProps extends BaseProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
}

// Overlay props
interface OverlayProps {
  centered?: boolean;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  visible?: boolean;
}

// Shared styled components
const BodyStyled = styled('div', {
  flex: '1 1 auto',
  minHeight: 0,
  overflowY: 'auto',
});

const Body = (
  props: React.HTMLAttributes<HTMLDivElement> & { noPadding?: boolean }
) => {
  const { noPadding, children, ...rest } = props;
  return (
    <BodyStyled
      css={{
        padding: noPadding ? '0px' : '1.5rem',
      }}
      {...rest}
    >
      {children}
    </BodyStyled>
  );
};

const CloseButton = styled('button', {
  background: 'transparent',
  border: 'none',
  borderRadius: '9999px',
  color: 'var(--cocoso-colors-gray-600)',
  cursor: 'pointer',
  padding: '0.5rem',
  transition: 'all 0.3s',
  '&:hover': {
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
  },
});

const Footer = styled('div', {
  alignItems: 'center',
  borderTop: '1px solid #e5e7eb',
  display: 'flex',
  gap: '0.75rem',
  justifyContent: 'flex-end',
  padding: '1.5rem',
  paddingTop: '1rem',
});

const Header = styled('div', {
  alignItems: 'center',
  borderBottom: '1px solid #e5e7eb',
  display: 'flex',
  justifyContent: 'space-between',
  minHeight: '1rem',
  padding: '1.5rem',
  paddingBottom: '1rem',
});

const Title = styled('h2', {
  color: '#111827',
  fontSize: '1.25rem',
  fontWeight: 600,
  margin: 0,
});

// Overlay component
const BaseOverlayStyled = styled('div', {
  backdropFilter: 'brightness(0.8)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  bottom: 0,
  left: 0,
  position: 'fixed',
  right: 0,
  top: 0,
  transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
  zIndex: 1405,
});

const BaseOverlay = (
  props: React.HTMLAttributes<HTMLDivElement> & {
    visible?: boolean;
    centered?: boolean;
    children?: React.ReactNode;
  }
) => {
  const { centered, visible, children, onClick, ...rest } = props;
  return (
    <BaseOverlayStyled
      css={{
        opacity: visible ? 1 : 0,
        visibility: visible ? 'visible' : 'hidden',
        ...(centered && {
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          padding: '1rem',
        }),
      }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </BaseOverlayStyled>
  );
};

export const Overlay: React.FC<OverlayProps> = ({
  centered = false,
  children,
  onClick,
  visible = false,
}) => {
  return (
    <BaseOverlay centered={centered} onClick={onClick} visible={visible}>
      {children}
    </BaseOverlay>
  );
};

// Modal content styling
const ModalContent = styled('div', {
  backgroundColor: 'var(--cocoso-colors-gray-50)',
  borderRadius: '0.5rem',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '90vh',
  minHeight: '50vh',
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.3s ease-in-out',
  width: '100%',
  variants: {
    size: {
      sm: { maxWidth: '24rem' },
      md: { maxWidth: '28rem' },
      lg: { maxWidth: '32rem' },
      xl: { maxWidth: '36rem' },
      '2xl': { maxWidth: '42rem' },
      '3xl': { maxWidth: '50rem' },
      full: { maxWidth: '100vw' },
    },
    visible: {
      true: {
        opacity: 1,
        transform: 'scale(1) translateY(0)',
      },
      false: {
        opacity: 0,
        transform: 'scale(0.95) translateY(20px)',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    visible: false,
  },
});

// Drawer content styling
const DrawerContent = styled('div', {
  backgroundColor: 'var(--cocoso-colors-gray-50)',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
  position: 'fixed',
  transition: 'all 0.3s ease-in-out',
  variants: {
    size: {
      sm: {
        width: '20rem',
        maxWidth: '90vw',
      },
      md: {
        width: '24rem',
        maxWidth: '90vw',
      },
      lg: {
        width: '28rem',
        maxWidth: '90vw',
      },
      xl: {
        width: '32rem',
        maxWidth: '90vw',
      },
      full: {
        width: '100vw',
        maxWidth: '100vw',
      },
    },
    visible: {
      true: {},
      false: {},
    },
    position: {
      bottom: {},
      left: {},
      right: {},
      top: {},
    },
  },
  compoundVariants: [
    {
      position: 'bottom',
      css: {
        bottom: 0,
        left: 0,
        right: 0,
        transform: 'translateY(100%)',
      },
    },
    {
      position: 'bottom',
      visible: true,
      css: { transform: 'translateY(0)' },
    },
    {
      position: 'top',
      css: {
        left: 0,
        right: 0,
        top: 0,
        transform: 'translateY(-100%)',
      },
    },
    {
      position: 'top',
      visible: true,
      css: { transform: 'translateY(0)' },
    },
    {
      position: 'left',
      css: {
        bottom: 0,
        left: 0,
        top: 0,
        transform: 'translateX(-100%)',
      },
    },
    {
      position: 'left',
      visible: true,
      css: { transform: 'translateX(0)' },
    },
    {
      position: 'right',
      css: {
        bottom: 0,
        right: 0,
        top: 0,
        transform: 'translateX(100%)',
      },
    },
    {
      position: 'right',
      visible: true,
      css: { transform: 'translateX(0)' },
    },
  ],
  defaultVariants: {
    size: 'md',
    position: 'right',
    visible: false,
  },
});

// Close icon component
const CloseIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// Shared hook for portal and keyboard handling
const usePortal = (open: boolean, onClose: () => void, portalId: string) => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  // Create portal container
  useEffect(() => {
    if (!portalContainer) {
      const container = document.createElement('div');
      container.id = portalId;
      document.body.appendChild(container);
      setPortalContainer(container);
    }

    return () => {
      if (portalContainer) {
        document.body.removeChild(portalContainer);
        setPortalContainer(null);
      }
    };
  }, [portalContainer, portalId]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  return portalContainer;
};

// Shared content component
const Content: React.FC<{
  cancelButtonProps?: object;
  cancelText?: string;
  children: React.ReactNode;
  confirmButtonProps?: object;
  confirmText?: string;
  hideFooter?: boolean;
  hideHeader?: boolean;
  noPadding?: boolean;
  onCancel?: () => void;
  onClose: () => void;
  onConfirm?: () => void;
  onSecondaryButtonClick?: () => void;
  title?: string;
}> = ({
  cancelButtonProps,
  cancelText,
  children,
  confirmButtonProps,
  confirmText,
  hideFooter = false,
  hideHeader = false,
  noPadding = false,
  onCancel,
  onClose,
  onConfirm,
  onSecondaryButtonClick,
  title,
}) => {
  const [tc] = useTranslation('common');

  // Handle cancel
  const handleCancel = () => {
    if (onSecondaryButtonClick) {
      onSecondaryButtonClick();
      return;
    }
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  // Handle confirm
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <>
      {/* Header */}
      {!hideHeader ? (
        <Header>
          {title ? <Title>{title}</Title> : <div></div>}
          <CloseButton aria-label="Close" onClick={onClose}>
            <CloseIcon />
          </CloseButton>
        </Header>
      ) : (
        <Box css={{ position: 'relative' }}>
          <CloseButton
            aria-label="Close"
            css={{
              position: 'absolute',
              right: '0.2rem',
              top: '0.2rem',
              zIndex: '1406',
            }}
            onClick={onClose}
          >
            <CloseIcon />
          </CloseButton>
        </Box>
      )}

      {/* Body */}
      <Body noPadding={noPadding}>{children}</Body>

      {/* Footer */}
      {!hideFooter && (
        <Footer>
          <Button
            variant="outline"
            onClick={handleCancel}
            {...cancelButtonProps}
          >
            {cancelText || tc('actions.cancel')}
          </Button>
          <Button onClick={handleConfirm} {...confirmButtonProps}>
            {confirmText || tc('actions.submit')}
          </Button>
        </Footer>
      )}
    </>
  );
};

// Modal component (default export)
const Modal: React.FC<ModalProps> = ({
  cancelButtonProps,
  cancelText,
  children,
  closeOnOverlayClick = true,
  confirmButtonProps,
  confirmText,
  hideFooter = false,
  hideHeader = false,
  id = 'modal-portal',
  noPadding,
  onCancel,
  onClose,
  onConfirm,
  onSecondaryButtonClick,
  open,
  size = 'md',
  title,
}) => {
  const portalContainer = usePortal(open, onClose, id);

  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  // Handle modal content click to prevent event bubbling
  const handleModalContentClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const modalContent = (
    <Overlay visible={open} onClick={handleOverlayClick} centered>
      <ModalContent
        size={size}
        visible={open}
        onClick={handleModalContentClick}
      >
        <Content
          cancelButtonProps={cancelButtonProps}
          cancelText={cancelText}
          confirmButtonProps={confirmButtonProps}
          confirmText={confirmText}
          hideFooter={hideFooter}
          hideHeader={hideHeader}
          noPadding={noPadding}
          title={title}
          onCancel={onCancel}
          onClose={onClose}
          onConfirm={onConfirm}
          onSecondaryButtonClick={onSecondaryButtonClick}
        >
          {children}
        </Content>
      </ModalContent>
    </Overlay>
  );

  // Always render modal, but control visibility with CSS
  if (portalContainer) {
    return createPortal(modalContent, portalContainer);
  }

  return modalContent;
};

// Drawer component (named export)
export const Drawer: React.FC<DrawerProps> = ({
  cancelText,
  children,
  closeOnOverlayClick = true,
  confirmText,
  hideFooter = true,
  hideHeader = false,
  noPadding,
  onCancel,
  onClose,
  onConfirm,
  onSecondaryButtonClick,
  open,
  position = 'right',
  size = 'md',
  title,
  styles,
}) => {
  const portalContainer = usePortal(open, onClose, 'drawer-portal');

  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  // Handle drawer content click to prevent event bubbling
  const handleDrawerContentClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const drawerContent = (
    <Overlay visible={open} onClick={handleOverlayClick}>
      <DrawerContent
        position={position}
        size={size}
        css={styles}
        visible={open}
        onClick={handleDrawerContentClick}
      >
        <Content
          cancelText={cancelText}
          confirmText={confirmText}
          hideFooter={hideFooter}
          hideHeader={hideHeader}
          title={title}
          noPadding={noPadding}
          onCancel={onCancel}
          onClose={onClose}
          onConfirm={onConfirm}
          onSecondaryButtonClick={onSecondaryButtonClick}
        >
          {children}
        </Content>
      </DrawerContent>
    </Overlay>
  );

  // Always render drawer, but control visibility with CSS
  if (portalContainer) {
    return createPortal(drawerContent, portalContainer);
  }

  return drawerContent;
};

export default memo(Modal);
