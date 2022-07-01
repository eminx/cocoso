import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import Template from '../components/Template';

const NotFoundPage = ({ domain, history }) => (
  <Template>
    <Box m="4" p="2">
      <Text textAlign="center" size="large" margin="2">
        404
      </Text>
      <Text textAlign="center" fontWeight="bold">
        {domain || 'Page'} could not be found
      </Text>
    </Box>
  </Template>
);

export default NotFoundPage;
