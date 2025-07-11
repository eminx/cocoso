import React, { ReactNode } from 'react';
import { styled } from 'restyle';

import { Flex } from './Box';
import { xToRem } from './functions';

// Button
interface ButtonProps {
  children?: any;
  color?: string;
  leftIcon?: ReactNode;
  mx?: string | number;
  ml?: string | number;
  mr?: string | number;
  mt?: string | number;
  mb?: string | number;
  my?: string | number;
  m?: string | number;
  rightIcon?: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'ghost' | 'outline';
  onClick?: () => void;
}

const ButtonComponent = styled('button', (props: ButtonProps) => {
  const variant = props.variant || 'solid';
  const size = props.size || 'md';
  return {
    backgroundColor:
      variant === 'ghost'
        ? 'none'
        : variant === 'outline'
        ? 'white'
        : 'var(--cocoso-colors-theme-500)',
    borderRadius: 'var(--cocoso-border-radius)',
    borderStyle: 'solid',
    borderWidth: variant === 'ghost' ? '0' : '2px',
    borderColor: props.color || 'var(--cocoso-colors-theme-500)',
    color:
      variant === 'solid' ? 'white' : 'var(--cocoso-colors-theme-500)',
    cursor: 'pointer',
    fontSize:
      size === 'xs'
        ? '0.75rem'
        : size === 'sm'
        ? '0.875rem'
        : size === 'lg'
        ? '1.125rem'
        : '1rem',
    fontWeight: 'bold',
    marginInline: xToRem(props.mx),
    marginInlineStart: xToRem(props.ml),
    marginInlineEnd: xToRem(props.mr),
    marginTop: xToRem(props.mt || props.my),
    marginBottom: xToRem(props.mb || props.my),
    margin: xToRem(props.m),
    paddingInline:
      variant === 'ghost'
        ? '0.75rem'
        : size === 'xs'
        ? '0.65rem'
        : size === 'sm'
        ? '0.85rem'
        : size === 'lg'
        ? '1.15rem'
        : '1rem',
    paddingTop:
      variant === 'ghost'
        ? '0.20rem'
        : size === 'xs'
        ? '0.35rem'
        : size === 'sm'
        ? '0.35rem'
        : size === 'lg'
        ? '0.55rem'
        : '0.45rem',
    paddingBottom:
      variant === 'ghost'
        ? '0.20rem'
        : size === 'xs'
        ? '0.35rem'
        : size === 'sm'
        ? '0.35rem'
        : size === 'lg'
        ? '0.55rem'
        : '0.45rem',
    ':hover': {
      backgroundColor:
        variant === 'solid'
          ? 'var(--cocoso-colors-theme-600)'
          : 'var(--cocoso-colors-theme-50)',
    },
    ':focus': {
      backgroundColor:
        variant === 'solid'
          ? 'var(--cocoso-colors-theme-700)'
          : 'var(--cocoso-colors-theme-100)',
    },
  };
});

export const Button = (props: ButtonProps) => {
  return (
    <ButtonComponent {...props}>
      <Flex align="center" gap="0.25rem">
        {props.leftIcon} {props.children} {props.rightIcon}
      </Flex>
    </ButtonComponent>
  );
};

interface IconButtonProps extends ButtonProps {
  icon: ReactNode;
}

const IconButtonComponent = styled(ButtonComponent, () => ({
  padding: '0.25rem',
}));

export const IconButton = (props: IconButtonProps) => {
  return (
    <IconButtonComponent {...props}>{props.icon}</IconButtonComponent>
  );
};
