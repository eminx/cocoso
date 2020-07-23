import React, { useContext } from 'react';
import { Redirect } from 'react-router';
import { Anchor, Box, Heading, Text } from 'grommet';

import Template from '../UIComponents/Template';
import { ForgotPassword, SimpleText } from './index';
import { StateContext } from '../LayoutContainer';

const ForgotPasswordPage = ({ history }) => {
  const { currentUser } = useContext(StateContext);

  if (currentUser) {
    return <Redirect to="/my-profile" />;
  }

  return (
    <Template>
      <Box width="medium" alignSelf="center">
        <Heading level={2}>Forgot Password</Heading>
        <Text size="large" margin={{ bottom: 'medium' }}>
          Reset your password via a link sent to your email
        </Text>
        <ForgotPassword />
        <Box
          direction="row"
          justify="around"
          margin={{ top: 'small', left: 'large', right: 'large' }}
        >
          <SimpleText>
            <Anchor onClick={() => history.push('/login')}>Login</Anchor>
          </SimpleText>
          <SimpleText>
            <Anchor onClick={() => history.push('/signup')}>Signup</Anchor>
          </SimpleText>
        </Box>
      </Box>
    </Template>
  );
};

export default ForgotPasswordPage;
