import React from 'react';
import { Box, Heading, Text } from 'grommet';
import Template from '../UIComponents/Template';

const NotFoundPage = ({ history }) => {
  return (
    <Template>
      <Box margin="large" pad="medium">
        <Text textAlign="center" size="xxlarge" margin="medium">
          404
        </Text>
        <Text textAlign="center" weight="bold">
          Page could not be found
        </Text>
      </Box>
    </Template>
  );
};

export default NotFoundPage;
