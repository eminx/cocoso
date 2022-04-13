import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Container, Row, Col, ScreenClassRender } from 'react-grid-system';
import { Box, Heading } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

const publicSettings = Meteor.settings.public;

const colStyle = {
  maxWidth: 588,
  margin: '0 auto',
};

function Template({
  heading,
  leftContent,
  rightContent,
  titleCentered = true,
  children,
}) {
  return (

    <ScreenClassRender render={(screenClass) => {

      const isMobile = ['xs', 'sm', 'md'].includes(screenClass);
      return (
        <Container fluid style={{ width: '100%', padding: 0, marginBottom: 24 }}>
          <Helmet>
            <title>{heading || publicSettings.name}</title>
          </Helmet>
          <Row gutterWidth={12} style={{ marginLeft: 0, marginRight: 0 }}>
            {!isMobile && 
              <Col lg={3} style={colStyle}>
                {leftContent}
              </Col>
            }
            <Col lg={6} style={{ ...colStyle, paddingLeft: 0, paddingRight: 0 }}>
              {heading && (
                <Box pl={titleCentered ? '0' : '2'} mb="2">
                  <Heading
                    as="h3"
                    mb="4"
                    size="md"
                    textAlign={titleCentered ? 'center' : 'start'}
                  >
                    {heading}
                  </Heading>
                </Box>
              )}
              {children}
            </Col>
            {isMobile && 
              <Col lg={3} style={colStyle}>
                {leftContent}
              </Col>
            }
            <Col lg={3} style={colStyle}>
              {rightContent}
            </Col>
          </Row>
        </Container>
      );

    }} />

  );
}

export default Template;
