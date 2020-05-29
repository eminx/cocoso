import React from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { Box, Heading } from 'grommet';

const colStyle = {
  maxWidth: 600,
  margin: '0 auto',
};

function Template({
  leftContent,
  rightContent,
  heading,
  titleCentered,
  children,
}) {
  return (
    <Container fluid style={{ width: '100%', marginBottom: 100 }}>
      <Row gutterWidth={12}>
        <Col lg={3} style={colStyle}>
          {leftContent}
        </Col>
        <Col lg={6} style={colStyle}>
          <Box>
            {heading && (
              <Box pad={{ top: 'small', bottom: 'small' }}>
                <Heading
                  level={2}
                  textAlign={titleCentered ? 'center' : 'start'}
                >
                  {heading}
                </Heading>
              </Box>
            )}
            {children}
          </Box>
        </Col>
        <Col lg={3} style={colStyle}>
          <Box margin={{ top: 'large' }}>{rightContent}</Box>
        </Col>
      </Row>
    </Container>
  );
}

export default Template;
