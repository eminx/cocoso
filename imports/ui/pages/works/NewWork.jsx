import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { call } from '../../utils/shared';
import WorkForm from './WorkForm';
import { StateContext } from '../../LayoutContainer';
import SuccessRedirector from '../../forms/SuccessRedirector';
import { message } from '../../generic/message';

export default function NewWork() {
  const [newEntryId, setNewEntryId] = useState(null);
  const { currentUser } = useContext(StateContext);
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
