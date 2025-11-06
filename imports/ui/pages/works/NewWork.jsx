import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAtomValue } from 'jotai';

import { currentUserAtom } from '/imports/state';
import { message } from '/imports/ui/generic/message';
import { call } from '/imports/api/_utils/shared';
import SuccessRedirector from '/imports/ui/forms/SuccessRedirector';

import WorkForm from './WorkForm';

export default function NewWork() {
  const currentUser = useAtomValue(currentUserAtom);
  const [newEntryId, setNewEntryId] = useState(null);
  const navigate = useNavigate();

  const createWork = async (newWork) => {
    try {
      const respond = await call('createWork', newWork);
      setNewEntryId(respond);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const handleSuccess = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    navigate(`/@${currentUser.username}/works/${newEntryId}/info`);
  };

  return (
    <SuccessRedirector ping={newEntryId} onSuccess={handleSuccess}>
      <WorkForm onFinalize={createWork} />
    </SuccessRedirector>
  );
}
