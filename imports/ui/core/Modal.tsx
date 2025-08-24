import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { styled } from 'restyle';
import { useTranslation } from 'react-i18next';

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
const Body = styled('div', (props: any) => ({
  flex: '1 1 auto',
  minHeight: 0,
  overflowY: 'auto',
  padding: props.noPadding ? '0px' : '1.5rem',
}));

const CloseButton = styled('button', {
  background: 'transparent',
  border: 'none',
  borderRadius: '9999px',
  color: 'var(--cocoso-colors-gray-600)',
  cursor: 'pointer',
  padding: '0.25rem',
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
const BaseOverlay = styled(
  'div',
  (props: { visible?: boolean; centered?: boolean }) => ({
    backdropFilter: 'brightness(0.8)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    bottom: 0,
    left: 0,
    opacity: props.visible ? 1 : 0,
    position: 'fixed',
    right: 0,
    top: 0,
    transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
    visibility: props.visible ? 'visible' : 'hidden',
    zIndex: 1405,
    ...(props.centered && {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      padding: '1rem',
    }),
  })
);

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
const ModalContent = styled(
  'div',
  (props: { size?: string; visible?: boolean }) => ({
    backgroundColor: 'var(--cocoso-colors-gray-50)',
    borderRadius: '0.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh',
    maxWidth:
      props.size === 'sm'
        ? '24rem'
        : props.size === 'lg'
        ? '32rem'
        : props.size === 'xl'
        ? '36rem'
        : props.size === '2xl'
        ? '42rem'
        : props.size === '3xl'
        ? '50rem'
        : props.size === 'full'
        ? '100vw'
        : '28rem',
    minHeight: '50vh',
    opacity: props.visible ? 1 : 0,
    overflow: 'hidden',
    position: 'relative',
    transform: props.visible
      ? 'scale(1) translateY(0)'
      : 'scale(0.95) translateY(20px)',
    transition: 'all 0.3s ease-in-out',
    width: '100%',
  })
);

// Drawer content styling
const DrawerContent = styled(
  'div',
  (props: {
    position?: string;
    size?: string;
    styles?: any;
    visible?: boolean;
  }) => {
    const maxHeight = props.size === 'full' ? '100vh' : '90vh';
    const maxSize = props.size === 'full' ? '100vw' : '90vw';
    const size =
      props.size === 'sm'
        ? '20rem'
        : props.size === 'lg'
        ? '28rem'
        : props.size === 'xl'
        ? '32rem'
        : props.size === 'full'
        ? '100vw'
        : '24rem';

    const base = {
      backgroundColor: 'var(--cocoso-colors-gray-50)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      position: 'fixed' as const,
      transition: 'all 0.3s ease-in-out',
    };

    if (props.position === 'bottom') {
      return {
        ...base,
        bottom: 0,
        height: size,
        left: 0,
        maxHeight: maxHeight,
        right: 0,
        transform: props.visible ? 'translateY(0)' : 'translateY(100%)',
      };
    }

    if (props.position === 'left') {
      return {
        ...base,
        bottom: 0,
        left: 0,
        maxWidth: maxSize,
        top: 0,
        transform: props.visible ? 'translateX(0)' : 'translateX(-100%)',
        width: size,
      };
    }

    if (props.position === 'top') {
      return {
        ...base,
        height: size,
        left: 0,
        maxHeight: maxHeight,
        right: 0,
        top: 0,
        transform: props.visible ? 'translateY(0)' : 'translateY(-100%)',
      };
    }

    // Default to right
    return {
      ...base,
      bottom: 0,
      maxWidth: maxSize,
      right: 0,
      top: 0,
      transform: props.visible ? 'translateX(0)' : 'translateX(100%)',
      width: size,
      ...props.styles,
    };
  }
);

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
          <CloseButton onClick={onClose} aria-label="Close">
            <CloseIcon />
          </CloseButton>
        </Header>
      ) : (
        <Box css={{ position: 'relative' }}>
          <CloseButton
            aria-label="Close"
            css={{
              padding: '0.5rem',
              position: 'absolute',
              right: '0.5rem',
              top: '0.5rem',
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
  noPadding,
  onCancel,
  onClose,
  onConfirm,
  onSecondaryButtonClick,
  open,
  size = 'md',
  title,
}) => {
  const portalContainer = usePortal(open, onClose, 'modal-portal');

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
        styles={styles}
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

export default Modal;
