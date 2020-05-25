import React from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { Box, Heading } from 'grommet';

const colStyle = {
  maxWidth: 600,
  margin: '0 auto',
};

function Template({ leftContent, rightContent, heading, children }) {
  return (
    <Container fluid style={{ width: '100%' }}>
      <Row gutterWidth={12}>
        <Col lg={3} style={colStyle}>
          {leftContent}
        </Col>
        <Col lg={6} style={colStyle}>
          <Box>
            {heading && (
              <Box pad={{ top: 'small', bottom: 'small' }}>
                <Heading level={3}>{heading}</Heading>
              </Box>
            )}
            {children}
          </Box>
        </Col>
        <Col lg={3} style={colStyle}>
          {rightContent}
        </Col>
      </Row>
    </Container>
  );
}

export default Template;
