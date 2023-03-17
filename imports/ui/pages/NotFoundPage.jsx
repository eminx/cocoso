import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Link as CLink, Text } from '@chakra-ui/react';
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
      <Text textAlign="center" mt="6">
        <Link to="/">
          <CLink color="#06c">Back to home page</CLink>
        </Link>
      </Text>
    </Box>
  </Template>
);

export default NotFoundPage;
