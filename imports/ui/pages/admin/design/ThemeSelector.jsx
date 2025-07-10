import React, { useState } from 'react';

import { Box, Button, Center, Flex, Text } from '/imports/ui/core';
import { RadioGroup, Radio } from '/imports/ui/generic/RadioButtons';
import ColorPicker from './ColorPicker';
import Boxling, {
  BoxlingColumn,
} from '/imports/ui/pages/admin/Boxling';
import Menu from '/imports/ui/generic/Menu';
import { borderRadiusOptions } from '/imports/ui/pages/admin/design/styleOptions';

export default function ThemeSelector() {
  const [theme, setTheme] = useState('light');

  const handleThemeChange = (value) => {
    setTheme(value);
  };

  const handleBorderStyleChange = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      style: {
        ...prevState.style,
        elements: {
          ...prevState.style.elements,
          [key]: value,
        },
      },
    }));
  };

  const borderRadius = 8;

  return (
    <>
      <Text fontWeight="light" my="4" size="lg">
        Theme affects many of the UI elements such as buttons
      </Text>

      {/* <Box py="6">
        <RadioGroup value={theme} onChange={handleThemeChange}>
          <Radio value="warm-gray">Warm Gray</Radio>
          <Radio value="cool-gray">Cool Gray</Radio>
          <Radio value="color">Custom Color</Radio>
        </RadioGroup>
      </Box> */}

      <Text fontWeight="bold" mt="6" mb="2">
        Demo
      </Text>

      <Center>
        <Box mb="8">
          <Flex align="center">
            <Button>Button</Button>
            <Button variant="outline">Button</Button>
            <Button variant="ghost">Button</Button>
          </Flex>
        </Box>
      </Center>

      <Box mb="8">
        <Text fontWeight="bold" mb="2">
          Color
        </Text>
        <Boxling>
          <ColorPicker />
        </Boxling>
      </Box>

      <Box mb="8">
        <Text fontWeight="bold" mb="2">
          Border
        </Text>
        <Boxling mb="8">
          <Flex>
            <BoxlingColumn title="Border Radius">
              <Menu
                options={borderRadiusOptions}
                onSelect={(selectedItem) =>
                  handleBorderStyleChange(
                    'borderRadius',
                    selectedItem.value
                  )
                }
              >
                {(item) => item.label}
              </Menu>
            </BoxlingColumn>
          </Flex>
        </Boxling>
      </Box>
    </>
  );
}
