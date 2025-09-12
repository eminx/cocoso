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

const RadioContainer = (props) => (
  <RadioContainerStyled
    css={{
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      opacity: props.disabled ? 0.6 : 1,
    }}
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

const RadioCircle = (props) => (
  <RadioCircleStyled
    css={{
      background: props.checked ? 'var(--cocoso-colors-theme-100)' : '#fff',
      border: `2px solid ${
        props.checked ? 'var(--cocoso-colors-theme-500)' : '#b3b3b3'
      }`,
    }}
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

const RadioDot = (props) => (
  <RadioDotStyled
    css={{
      display: props.checked ? 'block' : 'none',
    }}
  />
);

export function Radio({
  isChecked,
  isDisabled,
  onChange,
  value,
  name,
  children,
  ...props
}) {
  const [focused, setFocused] = React.useState(false);

  return (
    <RadioContainer disabled={isDisabled}>
      <HiddenInput
        aria-checked={isChecked}
        aria-disabled={isDisabled}
        checked={isChecked}
        disabled={isDisabled}
        name={name}
        onBlur={() => setFocused(false)}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        type="radio"
        value={value}
        {...props}
      />
      <RadioCircle checked={isChecked} focused={focused}>
        <RadioDot checked={isChecked} />
      </RadioCircle>
      {children && <Text css={{ fontWeight: 'bold' }}>{children}</Text>}
    </RadioContainer>
  );
}

export function RadioGroup({
  direction = 'row',
  name,
  spacing = '1.5rem',
  value,
  children,
  onChange,
  ...props
}) {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <Flex direction={direction} gap={spacing} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          isChecked: child.props.value === value,
          name,
          onChange: handleChange,
        });
      })}
    </Flex>
  );
}
