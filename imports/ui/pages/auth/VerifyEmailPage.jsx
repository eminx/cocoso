import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { Center } from '@chakra-ui/react';

function VerifyEmailPage({ match }) {
  const { token } = match.params;
  const [verificationMessage, setVerificationMessage] = useState('');

  useEffect(() => {
    Meteor.call('verifyUserEmail', token, (error, respond) => {
      if (error) {
        // console.log(error);
        throw Meteor.Error('error', error);
      } else {
        // console.log(respond);
        setVerificationMessage(respond);
      }
    });
  }, []);

  return <Center>{verificationMessage}</Center>;
}

export default VerifyEmailPage;
