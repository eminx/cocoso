import React, { useEffect, useRef } from 'react';
import { styled } from 'restyle';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  isOpen: boolean;
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
const Overlay = styled('div', {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(4px)',
  zIndex: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
});

const ModalContent = styled('div', (props: { size?: string }) => ({
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
}));

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

const Button = styled('button', {
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  borderRadius: '0.375rem',
  transition: 'all 0.2s',
  border: '1px solid transparent',
  cursor: 'pointer',
  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
  },
});

const CancelButton = styled(Button, {
  color: '#374151',
  backgroundColor: 'white',
  borderColor: '#d1d5db',
  '&:hover': {
    backgroundColor: '#f9fafb',
  },
});

const ConfirmButton = styled(Button, {
  color: 'white',
  backgroundColor: '#2563eb',
  borderColor: 'transparent',
  '&:hover': {
    backgroundColor: '#1d4ed8',
  },
});

const Modal: React.FC<ModalProps> = ({
  isOpen,
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

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

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

  if (!isOpen) return null;

  return (
    <Overlay ref={overlayRef} onClick={handleOverlayClick}>
      <ModalContent size={size}>
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
              <CancelButton onClick={handleCancel}>
                {cancelText || tc('actions.cancel')}
              </CancelButton>
            )}
            {confirmText && (
              <ConfirmButton onClick={handleConfirm}>
                {confirmText || tc('actions.submit')}
              </ConfirmButton>
            )}
          </Footer>
        )}
      </ModalContent>
    </Overlay>
  );
};

export default Modal;
