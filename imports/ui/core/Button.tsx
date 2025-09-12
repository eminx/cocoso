import React, { ReactNode } from 'react';
import { styled } from '@stitches/react';

import { Flex } from './Box';
import { xToRem } from './functions';

// Button
interface ButtonProps {
  as?: string;
  children?: any;
  color?: string;
  colorScheme?: string;
  disabled?: boolean;
  isDisabled?: boolean; // backwards compatibility
  leftIcon?: ReactNode;
  loading?: boolean;
  isLoading?: boolean; // backwards compatibility
  mx?: string | number;
  ml?: string | number;
  mr?: string | number;
  mt?: string | number;
  mb?: string | number;
  my?: string | number;
  m?: string | number;
  rightIcon?: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  variant?: 'solid' | 'ghost' | 'outline';
  onClick?: () => void;
  css?: any;
  style?: any;
}

const ButtonComponentStyled = styled('button', {
  borderRadius: 'var(--cocoso-border-radius)',
  borderStyle: 'solid',
  fontWeight: 'bold',
});

const ButtonComponent = (props: ButtonProps) => {
  const {
    variant = 'solid',
    size = 'md',
    disabled: disabledProp,
    isDisabled,
    colorScheme = 'theme',
    children,
    ...rest
  } = props;
  const disabled = disabledProp || isDisabled;

  // Color variables
  const bg =
    variant === 'ghost'
      ? 'none'
      : variant === 'outline'
      ? 'white'
      : `var(--cocoso-colors-${colorScheme}-500)`;
  const border = props.color || `var(--cocoso-colors-${colorScheme}-200)`;
  const textColor =
    variant === 'solid' ? 'white' : `var(--cocoso-colors-${colorScheme}-500)`;
  const hoverBg =
    variant === 'solid'
      ? `var(--cocoso-colors-${colorScheme}-600)`
      : `var(--cocoso-colors-${colorScheme}-50)`;
  const focusBg =
    variant === 'solid'
      ? `var(--cocoso-colors-${colorScheme}-700)`
      : `var(--cocoso-colors-${colorScheme}-100)`;

  return (
    <ButtonComponentStyled
      disabled={disabled}
      {...rest}
      css={{
        backgroundColor: bg,
        borderWidth: variant === 'ghost' ? '0' : '2px',
        borderColor: border,
        color: textColor,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize:
          size === 'xs'
            ? '0.75rem'
            : size === 'sm'
            ? '0.875rem'
            : size === 'lg'
            ? '1.1rem'
            : '1rem',
        marginInline: xToRem(props.mx),
        marginInlineStart: xToRem(props.ml),
        marginInlineEnd: xToRem(props.mr),
        marginTop: xToRem(props.mt || props.my),
        marginBottom: xToRem(props.mb || props.my),
        margin: xToRem(props.m),
        opacity: disabled ? 0.6 : 1,
        paddingInline:
          size === 'xs'
            ? '0.65rem'
            : size === 'sm'
            ? '0.85rem'
            : size === 'lg'
            ? '1.15rem'
            : '1rem',
        paddingTop:
          size === 'xs'
            ? '0.35rem'
            : size === 'sm'
            ? '0.35rem'
            : size === 'lg'
            ? '0.55rem'
            : '0.45rem',
        paddingBottom:
          size === 'xs'
            ? '0.35rem'
            : size === 'sm'
            ? '0.35rem'
            : size === 'lg'
            ? '0.55rem'
            : '0.45rem',
        pointerEvents: disabled ? 'none' : 'auto',
        '&:hover': {
          backgroundColor: disabled ? undefined : hoverBg,
        },
        '&:focus': {
          backgroundColor: disabled ? undefined : focusBg,
        },
      }}
    >
      {children}
    </ButtonComponentStyled>
  );
};

export const Button = ({
  disabled,
  isDisabled,
  isLoading,
  loading,
  leftIcon,
  rightIcon,
  children,
  onClick,
  ...rest
}: ButtonProps) => {
  const itsLoading = loading || isLoading;
  const itsDisabled = disabled || isDisabled || itsLoading;

  return (
    <ButtonComponent
      disabled={itsDisabled}
      onClick={isDisabled ? undefined : onClick}
      {...rest}
    >
      <Flex align="center" justify="center" gap="0.25rem">
        {itsLoading && (
          <div
            style={{
              width: '1rem',
              height: '1rem',
              border: '2px solid currentColor',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginRight: '0.25rem',
            }}
          />
        )}
        {!itsLoading && leftIcon ? leftIcon : null}
        {children}
        {!loading && rightIcon ? rightIcon : null}
      </Flex>
    </ButtonComponent>
  );
};

interface IconButtonProps
  extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
  icon: ReactNode;
  'aria-label': string;
  colorScheme?: string;
  style?: React.CSSProperties;
}

export const IconButton = (props: IconButtonProps) => {
  const {
    icon,
    'aria-label': ariaLabel,
    disabled: disabledProp,
    colorScheme = 'theme',
    isDisabled,
    loading: loadingProp,
    isLoading,
    size = 'md',
    variant = 'ghost',
    ...rest
  } = props;

  const disabled = disabledProp || isDisabled;
  const loading = loadingProp || isLoading;
  const isDisabledFinal = disabled || loading;

  return (
    <ButtonComponent
      size={size}
      variant={variant}
      aria-label={ariaLabel}
      colorScheme={colorScheme}
      disabled={isDisabledFinal}
      onClick={isDisabledFinal ? undefined : props.onClick}
      style={{
        borderRadius: 'var(--cocoso-border-radius)',
        padding:
          size === 'xs'
            ? '0.25rem'
            : size === 'sm'
            ? '0.35rem'
            : size === 'lg'
            ? '0.65rem'
            : '0.5rem',
        width:
          size === 'xs'
            ? '2rem'
            : size === 'sm'
            ? '2.25rem'
            : size === 'lg'
            ? '2.75rem'
            : '2.5rem',
        height:
          size === 'xs'
            ? '2rem'
            : size === 'sm'
            ? '2.25rem'
            : size === 'lg'
            ? '2.75rem'
            : '2.5rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...rest.style,
      }}
      {...rest}
    >
      {loading ? (
        <div
          style={{
            width: '1rem',
            height: '1rem',
            border: '2px solid currentColor',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      ) : (
        icon
      )}
    </ButtonComponent>
  );
};
