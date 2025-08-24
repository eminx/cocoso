import React from 'react';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: string;
  invalid?: boolean;
  isInvalid?: boolean;
  disabled?: boolean;
  isDisabled?: boolean;
  required?: boolean;
  isRequired?: boolean;
  readOnly?: boolean;
  isReadOnly?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      colorScheme = 'theme',
      invalid,
      isInvalid,
      disabled,
      isDisabled,
      required,
      isRequired,
      readOnly,
      isReadOnly,
      style,
      ...rest
    },
    ref
  ) => {
    const isInputDisabled = disabled || isDisabled;
    const isInputInvalid = invalid || isInvalid;
    const isInputReadOnly = readOnly || isReadOnly;
    const isInputRequired = required || isRequired;
    const sizeClass = `cocoso-input--${size}`;
    return (
      <input
        ref={ref}
        className={`cocoso-input ${sizeClass}`}
        disabled={isInputDisabled}
        required={isInputRequired}
        readOnly={isInputReadOnly}
        aria-invalid={isInputInvalid}
        style={style}
        {...rest}
      />
    );
  }
);
Input.displayName = 'Input';
export default Input;
