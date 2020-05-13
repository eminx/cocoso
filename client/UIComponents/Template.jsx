import React from 'react';
import { Row, Col } from 'antd/lib';
import { Box, Heading } from 'grommet';

function Template({ leftContent, rightContent, heading, children }) {
  return (
    <div>
      <Row>
        <Col md={6} />
        <Col md={12}>
          {heading && (
            <Box pad={{ left: 'medium', top: 'small' }}>
              <Heading level={3}>{heading}</Heading>
            </Box>
          )}
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Box pad="small">{leftContent}</Box>
        </Col>
        <Col md={12}>
          <Box pad="medium">{children}</Box>
        </Col>
        <Col md={6}>
          <Box pad="small">{rightContent}</Box>
        </Col>
      </Row>
    </div>
  );
}

export default Template;
