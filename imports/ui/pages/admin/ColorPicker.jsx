import React, { useContext, useState } from 'react';
import { Box, Button, Center, Code, Flex, Text } from '@chakra-ui/react';
import { HuePicker } from 'react-color';
import { useTranslation } from 'react-i18next';

import { StateContext } from '../../LayoutContainer';
import Boxling from './Boxling';

const getDefaultColor = (hue) => ({ h: hue, s: 80, l: 0.1, a: 0 });

const getHue = (pickedColor) => {
  const hue = parseInt(pickedColor?.hsl?.h) + 1;
  return hue.toString();
};

const parseHue = (hue, lightness) => {
  if (!hue) {
    return null;
  }
  return `hsla(${hue}deg, 80%,${lightness}%, 1)`;
};

export default function ColorPicker() {
  const { currentHost, hue, setHue, setSelectedHue } = useContext(StateContext);
  const [color, setColor] = useState(getDefaultColor(Number(hue) || 233));
  const [tc] = useTranslation('common');
  const [t] = useTranslation('admin');

  const handleChange = (pickedColor) => {
    if (pickedColor?.hsl?.h === color?.hsl?.h) {
      return;
    }
    setColor(pickedColor);
    const parsedHue = getHue(pickedColor);
    setHue(parsedHue);
  };

  const originalHostHue = currentHost?.settings?.hue;

  return (
    <>
      <Box>
        <Text mb="4">{t('color.info')}</Text>
      </Box>
      <Boxling>
        <Center pb="4" pt="2" position="relative">
          <HuePicker color={color} height="20px" width="100%" onChange={handleChange} />
        </Center>

        <Center bg={parseHue(hue, 90)} p="4">
          <Center borderRadius="50%" bg={parseHue(hue, 40)} height="120px" width="120px">
            <Code bg="none" color="white" fontWeight="bold">
              hue: {hue}
            </Code>
          </Center>
        </Center>
      </Boxling>

      {hue !== originalHostHue && (
        <Box>
          <Center my="4">
            <Flex flexDirection="column">
              <Button mb="2" onClick={setSelectedHue}>
                {tc('actions.submit')}
              </Button>
              <Button colorScheme="orange" variant="ghost" onClick={() => setHue(originalHostHue)}>
                {t('color.revert')}
              </Button>
            </Flex>
          </Center>

          <Box bg="red.50" borderRadius="lg" fontWeight="bold" p="4">
            <Text mb="2">{t('color.alert1')}</Text> <Text>{t('color.alert2')}</Text>
          </Box>
        </Box>
      )}
    </>
  );
}
