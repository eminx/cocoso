import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { Center } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { message } from '../../components/message';

function VerifyEmailPage({ match }) {
  const [tc] = useTranslation('common');
  const { token } = match.params;
  const [verificationMessage, setVerificationMessage] = useState('');

  useEffect(() => {
    Meteor.call('verifyUserEmail', token, (error, respond) => {
      if (error) { 
        message.error(error.reason) 
        return; 
      } 
      setVerificationMessage(respond);
    });
  }, []);

  return (
    <Center>
      {verificationMessage === 'verified'
        ? tc('message.verifyEmail.verified')
        : tc('message.verifyEmail.alreadyVerified')}
    </Center>
  );
}

export default VerifyEmailPage;
