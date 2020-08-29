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
    <Container fluid style={{ width: '100%', marginBottom: 100, padding: 0 }}>
      <Row gutterWidth={12}>
        <Col lg={3} style={colStyle}>
          {leftContent}
        </Col>
        <Col lg={6} style={colStyle}>
          <Box>
            {heading && (
              <Box pad="small">
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
          {rightContent}
        </Col>
      </Row>
    </Container>
  );
};

export default Template;
