import React, { useContext, useState } from 'react';
import { Box, Center } from '@chakra-ui/react';
import { HuePicker } from 'react-color';

import { StateContext } from '../../LayoutContainer';

const defaultColor = { h: 180, s: 60, l: 0.1, a: 0 };

function ColorPicker() {
  const [color, setColor] = useState(defaultColor);
  const { hue, setHue } = useContext(StateContext);

  const handleChange = (pickedColor, event) => {
    if (pickedColor?.hsl?.h === color?.hsl?.h) {
      return;
    }
    setColor(pickedColor);
    const parsedHue = parseInt(pickedColor?.hsl?.h) + 1;
    setHue(parsedHue.toString());
  };

  return (
    <>
      <Center py="4" position="relative">
        <HuePicker color={color} height="20px" width="100%" onChange={handleChange} />
      </Center>

      <Center>
        <Box
          height="120px"
          width="120px"
          borderRadius="50%"
          borderWidth="3px"
          borderColor="white"
          backgroundColor={parseHue(color.hsl)}
        />
      </Center>
    </>
  );
}

const parseHue = (hsl) => {
  if (!hsl) {
    return null;
  }
  const { h } = hsl;
  return `hsla(${h}deg, 50%, 50%, 1)`;
};

export default ColorPicker;
