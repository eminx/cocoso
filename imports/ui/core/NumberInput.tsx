import React from 'react';
import Input, { InputProps } from './Input';

export interface NumberInputProps extends Omit<InputProps, 'type'> {
  min?: number;
  max?: number;
  step?: number;
}

const NumberInput = React.forwardRef<
  HTMLInputElement,
  NumberInputProps
>(
  (
    {
      min,
      max,
      step,
      size,
      colorScheme,
      disabled,
      isDisabled,
      required,
      isRequired,
      readOnly,
      isReadOnly,
      ...rest
    },
    ref
  ) => {
    return (
      <Input
        ref={ref}
        type="number"
        min={min}
        max={max}
        step={step}
        size={size}
        colorScheme={colorScheme}
        disabled={disabled || isDisabled}
        required={required || isRequired}
        readOnly={readOnly || isReadOnly}
        {...rest}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';

export default NumberInput;
