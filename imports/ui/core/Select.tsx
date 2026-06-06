import React from 'react';
import ArrowDownIcon from 'lucide-react/dist/esm/icons/chevron-down';

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
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

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
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
      value,
      onChange,
      children,
      ...rest
    },
    ref
  ) => {
    const isSelectDisabled = disabled || isDisabled;
    const isSelectInvalid = invalid || isInvalid;
    const isSelectRequired = required || isRequired;
    const sizeClass = `cocoso-select--${size}`;
    return (
      <div
        style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
      >
        <select
          ref={ref}
          className={`cocoso-select ${sizeClass}`}
          defaultValue={value}
          disabled={isSelectDisabled}
          required={isSelectRequired}
          onChange={onChange}
          aria-invalid={isSelectInvalid}
          style={style}
          {...rest}
        >
          {children}
        </select>
        <ArrowDownIcon style={{ position: 'absolute', right: '12px' }} />
      </div>
    );
  }
);
Select.displayName = 'Select';
export default Select;
