import { Meteor } from 'meteor/meteor';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAtomValue } from 'jotai';

import { Center, Loader } from '/imports/ui/core';
import { currentUserAtom } from '/imports/state';
import { AVATAR_BASED_RETURN, startDirectAuthFlow } from './SsoButton';

export default function ResetPasswordPage() {
  const currentUser = useAtomValue(currentUserAtom);
  const navigate = useNavigate();
  const { token } = useParams();
  const authDomain = Meteor.settings.public?.authDomain;

  useEffect(() => {
    if (currentUser) {
      navigate(`/@${currentUser.username}`);
      return;
    }
    if (authDomain && token) {
      // Completing the reset on the broker mints a code and redirects back
      // here via /sso-callback (see handleResetPassword in
      // BrokerAuthPage.tsx) — same avatar-based landing as /register.
      startDirectAuthFlow(
        authDomain,
        `/reset-password/${token}`,
        AVATAR_BASED_RETURN
      );
    }
  }, [currentUser]);

  return (
    <Center p="8">
      <Loader speed={1} />
    </Center>
  );
}
