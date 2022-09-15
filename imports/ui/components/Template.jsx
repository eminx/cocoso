import { Meteor } from 'meteor/meteor';
import React, { useContext } from 'react';
import { Box, Container, Heading, SimpleGrid } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

import { StateContext } from '../LayoutContainer';

const publicSettings = Meteor.settings.public;

function Template({ heading, leftContent, rightContent, titleCentered = true, children }) {
  const { isDesktop } = useContext(StateContext);

  return (
    <>
      <Helmet>
        <title>{heading || publicSettings.name}</title>
      </Helmet>
      {isDesktop ? (
        <SimpleGrid columns={{ md: 1, lg: 3 }} templateColumns="25% 50% 25%">
          <Box pl="4">{leftContent}</Box>

          <Box>
            {heading && (
              <Box pl={titleCentered ? '0' : '2'} mb="2">
                <Heading as="h3" mb="4" size="md" textAlign={titleCentered ? 'center' : 'start'}>
                  {heading}
                </Heading>
              </Box>
            )}
            <Container>{children}</Container>
          </Box>

          <Box>{rightContent}</Box>
        </SimpleGrid>
      ) : (
        <>
          <Box pl="4">{leftContent}</Box>
          <Box>
            {heading && (
              <Box pl={titleCentered ? '0' : '2'} mb="2">
                <Heading as="h3" mb="4" size="md" textAlign={titleCentered ? 'center' : 'start'}>
                  {heading}
                </Heading>
              </Box>
            )}
            <Container>{children}</Container>
          </Box>
          <Box>{rightContent}</Box>
        </>
      )}
    </>
  );
}

export default Template;
