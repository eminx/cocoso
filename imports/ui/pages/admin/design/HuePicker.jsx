import React, { useState } from 'react';
import { HuePicker as HuePickerComponent } from 'react-color';
import { Trans } from 'react-i18next';
import { useAtom } from 'jotai';

import { Box, Button, Center, Code, Flex, Text } from '/imports/ui/core';
import { currentHostAtom } from '/imports/ui/LayoutContainer';
import Boxling from '/imports/ui/pages/admin/Boxling';

const getColorForPicker = (hue) => ({ h: hue, s: 80, l: 0.1, a: 0 });

const parseHue = (hue, lightness) => {
  if (!hue) {
    return null;
  }
  return `hsla(${hue}deg, 80%,${lightness}%, 1)`;
};

export default function HuePicker({ onChange }) {
  const [currentHost, setCurrentHost] = useAtom(currentHostAtom);
  const [initialHue] = useState(currentHost?.theme?.hue);

  const handleChange = (pickedColor) => {
    const pickedHue = parseInt(pickedColor?.hsl?.h, 10) + 1;
    if (pickedHue === pickedColor?.hsl?.h) {
      return;
    }

    setCurrentHost((prevState) => ({
      ...prevState,
      theme: {
        ...prevState.theme,
        hue: pickedHue,
      },
    }));

    onChange();
  };

  const resetHue = () => {
    setCurrentHost((prevState) => ({
      ...prevState,
      theme: { ...prevState.theme, hue: initialHue },
    }));

    onChange();
  };

  const hue = currentHost?.theme?.hue;
  const color = getColorForPicker(hue);

  return (
    <>
      <Box pb="4">
        <p>
          <Text mb="2" css={{ fontWeight: 'bold' }}>
            <Trans i18nKey="admin:design.color.select" />
          </Text>
        </p>
        <Text mb="4" size="sm">
          <Trans i18nKey="admin:design.color.info" />
        </Text>
      </Box>

      <Center css={{ paddingBottom: '1rem', position: 'relative' }}>
        <HuePickerComponent
          color={color}
          height="20px"
          width="100%"
          onChange={handleChange}
        />
      </Center>

      {hue !== color?.hsl?.h && (
        <>
          <Center p="4" css={{ backgroundColor: parseHue(hue, 90) }}>
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
            >
              <Code fontWeight="bold" size="sm">
                hue: {hue}
              </Code>
            </Flex>
          </Center>

          <Center style={{ justifyContent: 'center', padding: '1rem 0' }}>
            <Flex align="center" direction="column">
              <Button
                colorScheme="red"
                size="sm"
                variant="ghost"
                onClick={resetHue}
              >
                <Trans i18nKey="admin:design.color.revert" />
              </Button>
            </Flex>
          </Center>
        </>
      )}
    </>
  );
}
