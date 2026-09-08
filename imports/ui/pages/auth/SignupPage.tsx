import { Meteor } from 'meteor/meteor';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAtomValue } from 'jotai';

import { Center, Loader } from '/imports/ui/core';
import { currentUserAtom, platformAtom } from '/imports/state';
import { AVATAR_BASED_RETURN, startSso } from './SsoButton';

export default function SignupPage() {
  const currentUser = useAtomValue(currentUserAtom);
  const platform = useAtomValue(platformAtom);
  const navigate = useNavigate();
  const authDomain = Meteor.settings.public?.authDomain;

  useEffect(() => {
    if (currentUser) {
      // Already signed in — nothing to register, same fallback as before.
      if (platform?.isFederationLayout) {
        navigate('/intro');
      } else {
        navigate(`/@${currentUser.username}`);
      }
      return;
    }
    if (authDomain) {
      startSso(authDomain, AVATAR_BASED_RETURN, 'register');
    }
  }, [currentUser]);

  return (
    <Center p="8">
      <Loader speed={1} />
    </Center>
  );
}
