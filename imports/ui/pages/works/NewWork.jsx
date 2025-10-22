import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAtomValue } from 'jotai';

import WorkForm from './WorkForm';
import { call } from '../../utils/shared';
import SuccessRedirector from '../../forms/SuccessRedirector';
import { message } from '../../generic/message';
import { currentUserAtom } from '../../LayoutContainer';

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
