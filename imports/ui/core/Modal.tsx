import React, { useEffect, useRef } from 'react';
import { styled } from 'restyle';
import { useTranslation } from 'react-i18next';

import { Button } from '/imports/ui/core';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  hideFooter?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Styled components using restyle
const Overlay = styled('div', (props: { visible?: boolean }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'brightness(0.8)',
  zIndex: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  opacity: props.visible ? 1 : 0,
  visibility: props.visible ? 'visible' : 'hidden',
  transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
}));

const ModalContent = styled(
  'div',
  (props: { size?: string; visible?: boolean }) => ({
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    maxWidth:
      props.size === 'sm'
        ? '24rem'
        : props.size === 'lg'
        ? '32rem'
        : props.size === 'xl'
        ? '36rem'
        : '28rem',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    position: 'relative',
    opacity: props.visible ? 1 : 0,
    transform: props.visible
      ? 'scale(1) translateY(0)'
      : 'scale(0.95) translateY(20px)',
    transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
  })
);

const Header = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1.5rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #e5e7eb',
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
  transition: 'all 0.2s',
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

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  hideFooter = false,
  size = 'md',
}) => {
  const [tc] = useTranslation('common');
  const overlayRef = useRef<HTMLDivElement>(null);

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

  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === overlayRef.current) {
      onClose();
    }
  };

  // Handle cancel
  const handleCancel = () => {
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
    <Overlay
      ref={overlayRef}
      onClick={handleOverlayClick}
      visible={open}
    >
      <ModalContent size={size} visible={open}>
        {/* Header */}
        {title && (
          <Header>
            <Title>{title}</Title>
            <CloseButton onClick={onClose} aria-label="Close">
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
            </CloseButton>
          </Header>
        )}

        {/* Body */}
        <Body>{children}</Body>

        {/* Footer */}
        {!hideFooter && (confirmText || cancelText) && (
          <Footer>
            {cancelText && (
              <Button variant="outline" onClick={handleCancel}>
                {cancelText || tc('actions.cancel')}
              </Button>
            )}
            {confirmText && (
              <Button onClick={handleConfirm}>
                {confirmText || tc('actions.submit')}
              </Button>
            )}
          </Footer>
        )}
      </ModalContent>
    </Overlay>
  );
};

export default Modal;
