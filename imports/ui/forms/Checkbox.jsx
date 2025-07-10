import React from 'react';
import { styled } from 'restyle';
import { Box, Flex, Text } from '/imports/ui/core';

// Styled components
const CheckboxContainer = styled('label', (props) => ({
  display: 'inline-flex',
  alignItems: 'center',
  cursor: props.disabled ? 'not-allowed' : 'pointer',
  opacity: props.disabled ? 0.6 : 1,
  position: 'relative',
  fontSize: '1rem',
  userSelect: 'none',
  gap: '0.5rem',
}));

const HiddenInput = styled('input', {
  position: 'absolute',
  opacity: 0,
  width: 0,
  height: 0,
  margin: 0,
  padding: 0,
});

const CheckboxBox = styled('span', (props) => ({
  background: props.checked ? 'var(--chakra-colors-brand-500)' : '#fff',
  border: `2px solid ${
    props.checked ? 'var(--chakra-colors-brand-500)' : '#b3b3b3'
  }`,
  borderRadius: '0.25rem',
  boxSizing: 'border-box',
  display: 'inline-block',
  height:
    props.size === 'sm'
      ? '1rem'
      : props.size === 'lg'
      ? '1.5rem'
      : '1.25rem',
  width:
    props.size === 'sm'
      ? '1rem'
      : props.size === 'lg'
      ? '1.5rem'
      : '1.25rem',
  position: 'relative',
  transition: 'all 0.2s ease-in-out',
  ...(props.focused && {
    boxShadow: '0 0 0 2px var(--chakra-colors-brand-200)',
    borderColor: 'var(--chakra-colors-brand-500)',
  }),
  ...(props.indeterminate && {
    background: 'var(--chakra-colors-brand-500)',
    borderColor: 'var(--chakra-colors-brand-500)',
  }),
}));

const CheckboxIcon = styled('svg', (props) => ({
  display: props.checked || props.indeterminate ? 'block' : 'none',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width:
    props.size === 'sm'
      ? '0.6rem'
      : props.size === 'lg'
      ? '0.9rem'
      : '0.75rem',
  height:
    props.size === 'sm'
      ? '0.6rem'
      : props.size === 'lg'
      ? '0.9rem'
      : '0.75rem',
  color: 'white',
  fill: 'currentColor',
}));

// Checkmark SVG for checked state
const CheckIcon = ({ size }) => (
  <CheckboxIcon checked size={size} viewBox="0 0 24 24">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </CheckboxIcon>
);

// Minus SVG for indeterminate state
const IndeterminateIcon = ({ size }) => (
  <CheckboxIcon indeterminate size={size} viewBox="0 0 24 24">
    <path d="M19 13H5v-2h14v2z" />
  </CheckboxIcon>
);

export function Checkbox({
  checked,
  indeterminate,
  disabled,
  onChange,
  size = 'md',
  children,
  ...props
}) {
  const [focused, setFocused] = React.useState(false);

  const handleChange = (event) => {
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <CheckboxContainer disabled={disabled}>
      <HiddenInput
        aria-checked={indeterminate ? 'mixed' : checked}
        aria-disabled={disabled}
        checked={checked}
        disabled={disabled}
        onBlur={() => setFocused(false)}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        type="checkbox"
        {...props}
      />
      <CheckboxBox
        checked={checked}
        focused={focused}
        indeterminate={indeterminate}
        size={size}
      >
        {indeterminate ? (
          <IndeterminateIcon size={size} />
        ) : (
          <CheckIcon size={size} />
        )}
      </CheckboxBox>
      {children && (
        <Text
          css={{
            fontWeight: 'normal',
            fontSize:
              size === 'sm'
                ? '0.875rem'
                : size === 'lg'
                ? '1.125rem'
                : '1rem',
          }}
        >
          {children}
        </Text>
      )}
    </CheckboxContainer>
  );
}

export function CheckboxGroup({
  direction = 'column',
  spacing = '0.75rem',
  children,
  value,
  onChange,
  ...props
}) {
  const handleChange = (event) => {
    if (onChange) {
      const newValue = event.target.checked
        ? [...(value || []), event.target.value]
        : (value || []).filter((v) => v !== event.target.value);
      onChange(newValue);
    }
  };

  return (
    <Flex direction={direction} gap={spacing} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          checked: (value || []).includes(child.props.value),
          onChange: handleChange,
        });
      })}
    </Flex>
  );
}

export default Checkbox;
