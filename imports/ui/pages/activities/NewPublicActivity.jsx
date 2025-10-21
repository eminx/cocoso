import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import PublicActivityForm from './PublicActivityForm';
import { call } from '../../utils/shared';
import SuccessRedirector from '../../forms/SuccessRedirector';
import { message } from '../../generic/message';

export default function NewPublicActivity() {
  const [newEntryId, setNewEntryId] = useState(null);
  const navigate = useNavigate();

  const createActivity = async (newActivity) => {
    try {
      const respond = await call('createActivity', newActivity);
      setNewEntryId(respond);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const handleSuccess = () => {
    navigate(`/activities/${newEntryId}/info`);
  };

  return (
    <SuccessRedirector ping={newEntryId} onSuccess={handleSuccess}>
      <PublicActivityForm onFinalize={createActivity} />
    </SuccessRedirector>
  );
}
