import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import Template from '../components/Template';

const NotFoundPage = ({ history }) => {
  return (
    <Template>
      <Box m="4" p="2">
        <Text textAlign="center" size="large" margin="2">
          404
        </Text>
        <Text textAlign="center" fontWeight="bold">
          Page could not be found dear
        </Text>
      </Box>
    </Template>
  );
};

export default NotFoundPage;
