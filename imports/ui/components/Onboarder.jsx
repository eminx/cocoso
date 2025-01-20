import React, { useRef } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';

function Onboarder({
  children,
  firstButtonLabel,
  footer,
  header,
  secondButtonLabel,
  trigger,
  onFirstButtonClick,
  onSecondButtonClick,
  ...otherProps
}) {
  const initialFocusRef = useRef();

  return (
    <Popover
      initialFocusRef={initialFocusRef}
      placement="bottom"
      closeOnBlur={false}
      {...otherProps}
      data-oid="h40:svi"
    >
      <PopoverTrigger data-oid="39y3r4.">
        <Box data-oid="pgzwzo1">{trigger}</Box>
      </PopoverTrigger>
      <PopoverContent color="white" bg="blue.800" borderColor="blue.800" data-oid="8:46rcp">
        <PopoverHeader pt={4} fontWeight="bold" border="0" data-oid="bisnoq-">
          {header}
        </PopoverHeader>
        <PopoverArrow data-oid="c3d80ob" />
        <PopoverCloseButton data-oid="7j9doa9" />
        <PopoverBody data-oid=":m6a5o9">{children}</PopoverBody>
        <PopoverFooter
          border="0"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pb={4}
          data-oid="tk0u.97"
        >
          {footer && (
            <Box fontSize="sm" data-oid="gnkg-bk">
              {footer}
            </Box>
          )}
          <ButtonGroup size="sm" data-oid="29jsu_e">
            {firstButtonLabel && onFirstButtonClick && (
              <Button colorScheme="green" onClick={onFirstButtonClick} data-oid="8qi-ehi">
                {firstButtonLabel}
              </Button>
            )}
            {secondButtonLabel && onSecondButtonClick && (
              <Button
                colorScheme="blue"
                ref={initialFocusRef}
                onClick={onSecondButtonClick}
                data-oid="ye:as3w"
              >
                {secondButtonLabel}
              </Button>
            )}
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}

export default Onboarder;
