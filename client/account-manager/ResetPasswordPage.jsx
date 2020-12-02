import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { Anchor, Box, Heading, Text } from 'grommet';

import Template from '../UIComponents/Template';
import { ResetPassword, SimpleText } from './index';
import { StateContext } from '../LayoutContainer';
import { call } from '../functions';
import { message } from '../UIComponents/message';

const ResetPasswordPage = ({ history, match }) => {
  const { currentUser } = useContext(StateContext);
  const { token } = match.params;

  const handleResetPassword = async (password) => {
    try {
      await call('resetPassword', token, password);
      message.success('Your password is successfully reset. Now you can login');
      history.push('/login');
    } catch (error) {
      message.error(error.reason);
    }
  };

  if (currentUser) {
    return <Redirect to="/my-profile" />;
  }

  return (
    <Template>
      <Box width="medium" alignSelf="center">
        <Heading level={2}>Reset Your Password</Heading>
        <Text size="large" margin={{ bottom: 'medium' }}>
          Type your desired password
        </Text>
        <ResetPassword onResetPassword={handleResetPassword} />
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

export default ResetPasswordPage;
