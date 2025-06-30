import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Text,
} from '@chakra-ui/react';
import { ChromePicker } from 'react-color';

import { message } from '/imports/ui/generic/message';
import { call } from '/imports/ui/utils/shared';
import { StateContext } from '/imports/ui/LayoutContainer';
import Boxling from '/imports/ui/pages/admin/Boxling';
import GenericColorPicker from '/imports/ui/generic/GenericColorPicker';

const demoMenuItems = [
  {
    name: 'Home',
  },
  {
    name: 'Program',
  },
  {
    name: 'Calendar',
  },
];

export default function MenuDesign() {
  const { currentHost, getCurrentHost } = useContext(StateContext);
  const [state, setState] = useState({
    style: currentHost?.style || {
      menu: {
        backgroundColor: '#faf7f5',
        color: '#58504b',
        fontStyle: 'normal',
        fontWeight: 'normal',
        textTransform: 'none',
      },
    },
  });

  const handleBackgroundColorChange = (color) => {
    setState((prevState) => ({
      ...prevState,
      style: {
        ...prevState.style,
        menu: {
          ...prevState.style.menu,
          backgroundColor: color.hex,
        },
      },
    }));
  };

  const resetBackgroundColor = () => {
    setState((prevState) => ({
      ...prevState,
      style: {
        ...prevState.style,
        menu: {
          ...prevState.style.menu,
          backgroundColor: '#faf7f5',
        },
      },
    }));
  };

  const handleTextColorChange = (color) => {
    setState((prevState) => ({
      ...prevState,
      style: {
        ...prevState.style,
        menu: {
          ...prevState.style.menu,
          color: color.hex,
        },
      },
    }));
  };

  const resetTextColor = () => {
    setState((prevState) => ({
      ...prevState,
      style: {
        ...prevState.style,
        menu: {
          ...prevState.style.menu,
          color: '#58504b',
        },
      },
    }));
  };

  const updateHostStyle = async () => {
    const newStyle = {
      ...state.style,
    };

    try {
      await call('updateHostStyle', newStyle);
      await getCurrentHost();
      message.success('Background saved');
    } catch (error) {
      message.error(error.error || error.reason);
    }
  };

  const { style } = state;
  const backgroundColor = style?.menu?.backgroundColor;
  const color = style?.menu?.color;

  return (
    <>
      <Text fontWeight="bold" mb="4">
        Demo
      </Text>
      <Box mb="8" w="100%">
        <HStack
          alignItems="center"
          bg={backgroundColor}
          borderRadius={6}
          color={color}
          justify="center"
          p="0.5rem"
          wrap="wrap"
        >
          {demoMenuItems?.map((item) => (
            <Box as="span" px="2">
              <Text
                borderBottom="1px solid transparent"
                _hover={{
                  borderBottom: '1px solid',
                  cursor: 'pointer',
                }}
              >
                {item.name}
              </Text>
            </Box>
          ))}
        </HStack>
      </Box>

      <Text fontWeight="bold" mb="4">
        Colors
      </Text>

      <Boxling mb="8" w="100%">
        <Flex justify="space-around">
          <Center>
            <Flex alignItems="center" flexDirection="column">
              <Text fontWeight="bold" mb="2">
                Background color
              </Text>
              <Box bg={backgroundColor} w="72px" h="24px" mb="4" />

              <Box mb="4">
                <GenericColorPicker
                  color={backgroundColor}
                  onChange={handleBackgroundColorChange}
                />
              </Box>

              <Button
                bg="white"
                size="xs"
                variant="ghost"
                onClick={resetBackgroundColor}
              >
                Reset
              </Button>
            </Flex>
          </Center>

          <Center>
            <Flex alignItems="center" flexDirection="column">
              <Text fontWeight="bold" mb="2">
                Text Color
              </Text>
              <Box bg={color} w="72px" h="24px" mb="4" />

              <Box mb="4">
                <GenericColorPicker
                  color={color}
                  onChange={handleTextColorChange}
                />
              </Box>

              <Button
                bg="white"
                size="xs"
                variant="ghost"
                onClick={resetTextColor}
              >
                Reset
              </Button>
            </Flex>
          </Center>
        </Flex>
      </Boxling>

      <Flex justify="flex-end">
        <Button mt="2" onClick={updateHostStyle}>
          Confirm
        </Button>
      </Flex>
    </>
  );
}
