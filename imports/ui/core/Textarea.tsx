import React from 'react';

export interface TextareaProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    'size'
  > {
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

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(
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
    const isTextareaDisabled = disabled || isDisabled;
    const isTextareaInvalid = invalid || isInvalid;
    const isTextareaReadOnly = readOnly || isReadOnly;
    const isTextareaRequired = required || isRequired;
    const sizeClass = `cocoso-textarea--${size}`;
    return (
      <textarea
        ref={ref}
        className={`cocoso-textarea ${sizeClass}`}
        disabled={isTextareaDisabled}
        required={isTextareaRequired}
        readOnly={isTextareaReadOnly}
        aria-invalid={isTextareaInvalid}
        style={style}
        {...rest}
      />
    );
  }
);
Textarea.displayName = 'Textarea';
export default Textarea;
