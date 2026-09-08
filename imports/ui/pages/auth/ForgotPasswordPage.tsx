import { Meteor } from 'meteor/meteor';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAtomValue } from 'jotai';

import { Center, Loader } from '/imports/ui/core';
import { currentUserAtom } from '/imports/state';
import { startDirectAuthFlow } from './SsoButton';

export default function ForgotPasswordPage() {
  const currentUser = useAtomValue(currentUserAtom);
  const navigate = useNavigate();
  const authDomain = Meteor.settings.public?.authDomain;

  useEffect(() => {
    if (currentUser) {
      // Already signed in — nothing to recover, same fallback as before.
      navigate(`/@${currentUser.username}`);
      return;
    }
    if (authDomain) {
      // No OAuth round-trip needed here — this step only sends an email,
      // it never completes a sign-in (see startDirectAuthFlow's own
      // comment in SsoButton.tsx).
      startDirectAuthFlow(authDomain, '/forgot-password');
    }
  }, [currentUser]);

  return (
    <Center p="8">
      <Loader speed={1} />
    </Center>
  );
}
