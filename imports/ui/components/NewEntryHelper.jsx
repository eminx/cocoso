import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, AlertTitle, AlertDescription, Box, Button, Center } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

function NewEntryHelper({ buttonLabel, buttonLink, title, children, isEmptyListing = false }) {
  const [tc] = useTranslation('common');
  const titleGeneric = isEmptyListing
    ? tc('message.newentryhelper.emptylisting.title')
    : tc('message.newentryhelper.title');

  const descriptionGeneric = isEmptyListing
    ? tc('message.newentryhelper.emptylisting.description')
    : tc('message.newentryhelper.description');

  const buttonLabelGeneric = tc('message.newentryhelper.button');

  return (
    <Box px="6">
      <Alert
        alignItems="center"
        colorScheme="green"
        flexDirection="column"
        justifyContent="center"
        my="4"
        py="0"
        textAlign="center"
        variant="subtle"
      >
        <AlertTitle mt={4} mb={1} fontSize="lg">
          {title || titleGeneric}
        </AlertTitle>

        <AlertDescription maxWidth="sm">
          {children || descriptionGeneric}
          <Center py="4">
            <Link to={buttonLink}>
              <Button colorScheme="green" as="span">
                {buttonLabel || buttonLabelGeneric}
              </Button>
            </Link>
          </Center>
        </AlertDescription>
      </Alert>
    </Box>
  );
}
export default NewEntryHelper;
