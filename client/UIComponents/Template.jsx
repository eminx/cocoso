import React from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { Box, Heading } from 'grommet';

const colStyle = {
  maxWidth: 600,
  margin: '0 auto',
};

const Template = ({
  leftContent,
  rightContent,
  heading,
  titleCentered,
  children,
}) => {
  return (
    <Container fluid style={{ width: '100%', padding: 0 }}>
      <Row gutterWidth={12} style={{ marginLeft: 0, marginRight: 0 }}>
        <Col lg={3} style={colStyle}>
          {leftContent}
        </Col>
        <Col lg={6} style={colStyle}>
          {heading && (
            <Box pad="medium">
              <Heading level={2} textAlign={titleCentered ? 'center' : 'start'}>
                {heading}
              </Heading>
            </Box>
          )}
          {children}
        </Col>
        <Col lg={3} style={colStyle}>
          {rightContent}
        </Col>
      </Row>
    </Container>
  );
};

export default Template;
