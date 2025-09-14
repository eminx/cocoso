import React from 'react';
import { styled } from '@stitches/react';

import { Flex, Text } from '/imports/ui/core';

// Styled components
const RadioContainerStyled = styled('label', {
  display: 'inline-flex',
  alignItems: 'center',
  position: 'relative',
  marginRight: '1.5rem',
  fontSize: '1rem',
  userSelect: 'none',
});

const RadioContainer = ({ disabled, ...rest }) => (
  <RadioContainerStyled
    css={{
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
    }}
    {...rest}
  />
);

const HiddenInput = styled('input', {
  position: 'absolute',
  opacity: 0,
  width: 0,
  height: 0,
  margin: 0,
  padding: 0,
});

const RadioCircleStyled = styled('span', {
  borderRadius: '50%',
  boxSizing: 'border-box',
  display: 'inline-block',
  height: '1.25em',
  marginRight: '0.5em',
  position: 'relative',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  width: '1.25em',
  '&:focus': {
    boxShadow: '0 0 0 2px var(--cocoso-colors-theme-200)',
    borderColor: 'var(--cocoso-colors-theme-500)',
  },
});

const RadioCircle = ({ checked, ...rest }) => (
  <RadioCircleStyled
    css={{
      background: checked ? 'var(--cocoso-colors-theme-100)' : '#fff',
      border: `2px solid ${
        checked ? 'var(--cocoso-colors-theme-500)' : '#b3b3b3'
      }`,
    }}
    {...rest}
  />
);

const RadioDotStyled = styled('span', {
  borderRadius: '50%',
  background: 'var(--cocoso-colors-theme-500)',
  height: '0.6em',
  left: '50%',
  position: 'absolute',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: '0.6em',
});

const RadioDot = ({ checked, ...rest }) => (
  <RadioDotStyled
    css={{
      display: checked ? 'block' : 'none',
    }}
    {...rest}
  />
);

export function Radio({ checked, label, disabled, value, onChange, ...props }) {
  const [focused, setFocused] = React.useState(false);

  return (
    <RadioContainer disabled={disabled}>
      <HiddenInput
        aria-checked={checked}
        aria-disabled={disabled}
        checked={checked}
        disabled={disabled}
        name={name}
        type="radio"
        value={value}
        onBlur={() => setFocused(false)}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        {...props}
      />
      <RadioCircle checked={checked} focused={focused}>
        <RadioDot checked={checked} />
      </RadioCircle>
      {label && <Text css={{ fontWeight: 'bold' }}>{label}</Text>}
    </RadioContainer>
  );
}

export function RadioGroup({
  children,
  direction = 'row',
  name,
  spacing = '1.5rem',
  value,
  options,
  onChange,
  ...props
}) {
  const handleChange = (event) => {
    console.log('value:', event.target.value);
    if (!onChange) return;
    onChange(event.target.value);
  };

  return (
    <Flex direction={direction} gap={spacing} {...props}>
      {options.map((option) => (
        <Radio
          key={option.value}
          checked={value === option.value}
          label={option.label}
          value={option.value}
          onChange={handleChange}
        />
      ))}
    </Flex>
  );
}
