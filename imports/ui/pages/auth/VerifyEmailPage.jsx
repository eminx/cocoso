import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { Center } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

function VerifyEmailPage({ match }) {
  const [tc] = useTranslation('common');
  const { token } = match.params;
  const [verificationMessage, setVerificationMessage] = useState('');

  useEffect(() => {
    Meteor.call('verifyUserEmail', token, (error, respond) => {
      if (error) {
        throw new Meteor.Error('error', error);
      } else {
        setVerificationMessage(respond);
      }
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
