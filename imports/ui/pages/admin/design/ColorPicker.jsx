import React, { useContext, useState } from 'react';
import { HuePicker } from 'react-color';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Button,
  Center,
  Code,
  Flex,
  Text,
} from '/imports/ui/core';
import { StateContext } from '/imports/ui/LayoutContainer';
import Boxling from '/imports/ui/pages/admin/Boxling';

const getDefaultColor = (hue) => ({ h: hue, s: 80, l: 0.1, a: 0 });

const getHue = (pickedHue) => {
  const hue = parseInt(pickedHue, 10) + 1;
  return hue.toString();
};

const parseHue = (hue, lightness) => {
  if (!hue) {
    return null;
  }
  return `hsla(${hue}deg, 80%,${lightness}%, 1)`;
};

export default function ColorPicker() {
  const { currentHost, hue, setHue, setSelectedHue } =
    useContext(StateContext);
  const [color, setColor] = useState(
    getDefaultColor(Number(hue) || 233)
  );
  const [tc] = useTranslation('common');
  const [t] = useTranslation('admin');

  const handleChange = (pickedColor) => {
    const pickedHue = pickedColor?.hsl?.h;
    if (pickedHue === color?.hsl?.h) {
      return;
    }
    setColor(pickedColor);
    const parsedHue = getHue(pickedHue);
    setHue(parsedHue);
  };

  const originalHostHue = currentHost?.settings?.hue;

  return (
    <>
      <Text mb="2">Select desired color from palette</Text>
      <Text mb="4" size="sm">
        {t('color.info')}
      </Text>

      <Boxling>
        <Center css={{ paddingBottom: '1rem' }} position="relative">
          <HuePicker
            color={color}
            height="20px"
            width="100%"
            onChange={handleChange}
          />
        </Center>

        <Center
          bg={parseHue(hue, 90)}
          p="4"
          style={{ justifyContent: 'center' }}
        >
          <Flex
            css={{
              alignItems: 'center',
              borderRadius: '50%',
              backgroundColor: parseHue(hue, 50),
              flexDirection: 'column',
              justifyContent: 'center',
              height: '120px',
              width: '120px',
            }}
            style={{ display: 'flex' }}
          >
            <Code
              css={{ color: 'white', fontWeight: 'bold' }}
              size="sm"
            >
              hue: {hue}
            </Code>
          </Flex>
        </Center>
      </Boxling>

      {hue !== originalHostHue && (
        <Box>
          <Center style={{ justifyContent: 'center' }}>
            <Flex align="center" flexDirection="column">
              <Button onClick={setSelectedHue}>
                {tc('actions.submit')}
              </Button>
              <Button
                colorScheme="orange"
                mb="4"
                variant="ghost"
                onClick={() => setHue(originalHostHue)}
              >
                {t('color.revert')}
              </Button>
            </Flex>
          </Center>

          <Box bg="red.50" borderRadius="lg" fontWeight="bold" p="4">
            <Text mb="2">{t('color.alert1')}</Text>{' '}
            <Text>{t('color.alert2')}</Text>
          </Box>
        </Box>
      )}
    </>
  );
}
