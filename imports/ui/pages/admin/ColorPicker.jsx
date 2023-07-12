import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Center } from '@chakra-ui/react';
import { HuePicker } from 'react-color';
import { useTranslation } from 'react-i18next';

import { StateContext } from '../../LayoutContainer';
import { message } from '../../components/message';
import { call } from '../../utils/shared';

const getDefaultColor = (hue) => ({ h: hue, s: 40, l: 0.1, a: 0 });

const getHue = (pickedColor) => {
  const hue = parseInt(pickedColor?.hsl?.h) + 1;
  return hue.toString();
};

function ColorPicker() {
  const { currentHost, hue, setHue } = useContext(StateContext);
  const [color, setColor] = useState(getDefaultColor(Number(hue) || 233));
  const [tc] = useTranslation('common');

  const handleChange = (pickedColor, event) => {
    if (pickedColor?.hsl?.h === color?.hsl?.h) {
      return;
    }
    setColor(pickedColor);
    const parsedHue = getHue(pickedColor);
    setHue(parsedHue);
  };

  const setSelectedHue = async () => {
    try {
      await call('setHostHue', hue);
      message.success(tc('message.success.update'));
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const originalHostHue = currentHost?.settings?.hue;

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
          backgroundColor={parseHue(color)}
        />
      </Center>

      {hue !== originalHostHue && <Button onClick={setSelectedHue}>{tc('actions.submit')}</Button>}
    </>
  );
}

const parseHue = (color) => {
  if (!color) {
    return null;
  }
  if (color.hsl) {
    const { h } = color.hsl;
    return `hsla(${h}deg, 50%, 50%, 1)`;
  } else {
    const { h } = color;
    return `hsla(${h}deg, 50%, 50%, 1)`;
  }
};

export default ColorPicker;
