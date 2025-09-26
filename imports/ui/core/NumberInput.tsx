import React from 'react';
import Input, { InputProps } from './Input';

export interface NumberInputProps extends Omit<InputProps, 'type'> {
  min?: number;
  max?: number;
  step?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
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
      onChange,
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
        onChange={onChange}
        {...rest}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';

export default NumberInput;
