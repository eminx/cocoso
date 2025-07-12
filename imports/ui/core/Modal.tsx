import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { styled } from 'restyle';
import { useTranslation } from 'react-i18next';

import { Button } from '/imports/ui/core';

// Common props interface
interface BaseProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onSecondaryButtonClick?: () => void;
  hideFooter?: boolean;
  hideHeader?: boolean;
  closeOnOverlayClick?: boolean;
}

// Modal-specific props
interface ModalProps extends BaseProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
}

// Drawer-specific props
interface DrawerProps extends BaseProps {
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

// Overlay props
interface OverlayProps {
  visible?: boolean;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  centered?: boolean;
}

// Shared styled components
const Header = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1.5rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #e5e7eb',
  minHeight: '1rem',
});

const Title = styled('h2', {
  fontSize: '1.25rem',
  fontWeight: 600,
  color: '#111827',
  margin: 0,
});

const CloseButton = styled('button', {
  padding: '0.25rem',
  borderRadius: '9999px',
  transition: 'all 0.3s',
  color: '#9ca3af',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
  },
});

const Body = styled('div', {
  padding: '1.5rem',
  overflowY: 'auto',
  flex: '1 1 auto',
  minHeight: 0,
});

const Footer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  padding: '1.5rem',
  paddingTop: '1rem',
  borderTop: '1px solid #e5e7eb',
});

// Overlay component
const BaseOverlay = styled(
  'div',
  (props: { visible?: boolean; centered?: boolean }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'brightness(0.8)',
    zIndex: 1405,
    opacity: props.visible ? 1 : 0,
    visibility: props.visible ? 'visible' : 'hidden',
    transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
    ...(props.centered && {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }),
  })
);

export const Overlay: React.FC<OverlayProps> = ({
  visible = false,
  children,
  onClick,
  centered = false,
}) => {
  return (
    <BaseOverlay
      visible={visible}
      centered={centered}
      onClick={onClick}
    >
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
    width: '100%',
    maxHeight: '90vh',
    minHeight: '50vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
    opacity: props.visible ? 1 : 0,
    transform: props.visible
      ? 'scale(1) translateY(0)'
      : 'scale(0.95) translateY(20px)',
    transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
  })
);

// Drawer content styling
const DrawerContent = styled(
  'div',
  (props: { position?: string; size?: string; visible?: boolean }) => {
    const sizeMap = {
      sm: '20rem',
      md: '24rem',
      lg: '28rem',
      xl: '32rem',
      full: '100vw',
    };

    const getSize = (dimension: 'width' | 'height') => {
      const size =
        sizeMap[props.size as keyof typeof sizeMap] || sizeMap.md;
      return props.size === 'full' ? '100vw' : size;
    };

    const getMaxSize = (dimension: 'width' | 'height') => {
      return props.size === 'full'
        ? '100vw'
        : dimension === 'width'
        ? '90vw'
        : '90vh';
    };

    const getPositionStyles = () => {
      const isHorizontal =
        props.position === 'left' || props.position === 'right';
      const isVertical =
        props.position === 'top' || props.position === 'bottom';

      const baseStyles = {
        position: 'fixed' as const,
        backgroundColor: 'var(--cocoso-colors-gray-50)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column' as const,
        overflow: 'hidden',
        transition: 'transform 0.3s ease-out',
      };

      if (isHorizontal) {
        return {
          ...baseStyles,
          top: 0,
          bottom: 0,
          [props.position === 'left' ? 'left' : 'right']: 0,
          transform: props.visible
            ? 'translateX(0)'
            : `translateX(${props.position === 'left' ? '-' : ''}100%)`,
          width: getSize('width'),
          maxWidth: getMaxSize('width'),
        };
      }

      if (isVertical) {
        return {
          ...baseStyles,
          left: 0,
          right: 0,
          [props.position === 'top' ? 'top' : 'bottom']: 0,
          transform: props.visible
            ? 'translateY(0)'
            : `translateY(${props.position === 'top' ? '-' : ''}100%)`,
          height: getSize('height'),
          maxHeight: getMaxSize('height'),
        };
      }

      // Default to right
      return {
        ...baseStyles,
        top: 0,
        right: 0,
        bottom: 0,
        transform: props.visible ? 'translateX(0)' : 'translateX(100%)',
        width: getSize('width'),
        maxWidth: getMaxSize('width'),
      };
    };

    return getPositionStyles();
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
const usePortal = (
  open: boolean,
  onClose: () => void,
  portalId: string
) => {
  const [portalContainer, setPortalContainer] =
    useState<HTMLElement | null>(null);

  // Create portal container
  useEffect(() => {
    if (open && !portalContainer) {
      const container = document.createElement('div');
      container.id = portalId;
      document.body.appendChild(container);
      setPortalContainer(container);
    }

    return () => {
      if (portalContainer && !open) {
        document.body.removeChild(portalContainer);
        setPortalContainer(null);
      }
    };
  }, [open, portalContainer, portalId]);

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
  children: React.ReactNode;
  title?: string;
  onClose: () => void;
  hideHeader?: boolean;
  hideFooter?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onSecondaryButtonClick?: () => void;
}> = ({
  children,
  title,
  onClose,
  hideHeader = false,
  hideFooter = false,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  onSecondaryButtonClick,
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
      {!hideHeader && (
        <Header>
          {title ? <Title>{title}</Title> : <div></div>}
          <CloseButton onClick={onClose} aria-label="Close">
            <CloseIcon />
          </CloseButton>
        </Header>
      )}

      {/* Body */}
      <Body>{children}</Body>

      {/* Footer */}
      {!hideFooter && (
        <Footer>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            {cancelText || tc('actions.cancel')}
          </Button>
          <Button size="sm" onClick={handleConfirm}>
            {confirmText || tc('actions.submit')}
          </Button>
        </Footer>
      )}
    </>
  );
};

// Modal component (default export)
const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  onSecondaryButtonClick,
  hideFooter = false,
  hideHeader = false,
  size = 'md',
  closeOnOverlayClick = true,
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
          title={title}
          onClose={onClose}
          hideHeader={hideHeader}
          hideFooter={hideFooter}
          confirmText={confirmText}
          cancelText={cancelText}
          onConfirm={onConfirm}
          onCancel={onCancel}
          onSecondaryButtonClick={onSecondaryButtonClick}
        >
          {children}
        </Content>
      </ModalContent>
    </Overlay>
  );

  // Render modal using portal if container exists, otherwise render normally
  if (portalContainer && open) {
    return createPortal(modalContent, portalContainer);
  }

  return open ? modalContent : null;
};

// Drawer component (named export)
export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  title,
  children,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  onSecondaryButtonClick,
  hideFooter = false,
  hideHeader = false,
  position = 'right',
  size = 'md',
  closeOnOverlayClick = true,
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
        visible={open}
        onClick={handleDrawerContentClick}
      >
        <Content
          title={title}
          onClose={onClose}
          hideHeader={hideHeader}
          hideFooter={hideFooter}
          confirmText={confirmText}
          cancelText={cancelText}
          onConfirm={onConfirm}
          onCancel={onCancel}
          onSecondaryButtonClick={onSecondaryButtonClick}
        >
          {children}
        </Content>
      </DrawerContent>
    </Overlay>
  );

  // Render drawer using portal if container exists, otherwise render normally
  if (portalContainer && open) {
    return createPortal(drawerContent, portalContainer);
  }

  return open ? drawerContent : null;
};

export default Modal;
