import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Alert, AlertTitle, AlertDescription, Box, Button, Center } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import renderHTML from 'react-render-html';

import { StateContext } from '../LayoutContainer';

function NewEntryHelper({ buttonLabel, buttonLink, title, children, isEmptyListing = false }) {
  const { currentHost } = useContext(StateContext);
  const location = useLocation();
  const [tc] = useTranslation('common');

  const activeMenuItem = currentHost?.settings?.menu?.find((item) =>
    location?.pathname?.split('/').includes(item.name)
  );

  const titleGeneric = isEmptyListing
    ? tc('message.newentryhelper.emptylisting.title')
    : tc('message.newentryhelper.title', { listing: activeMenuItem?.label });

  const descriptionGeneric = isEmptyListing
    ? tc('message.newentryhelper.emptylisting.description')
    : tc('message.newentryhelper.description');

  const buttonLabelGeneric = tc('message.newentryhelper.button');

  return (
    <Box px="4">
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
          {title ? renderHTML(title) : titleGeneric && renderHTML(titleGeneric)}
        </AlertTitle>

        <AlertDescription maxWidth="sm">
          {(children && renderHTML(children)) ||
            (descriptionGeneric && renderHTML(descriptionGeneric))}
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
