import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { call } from '../../utils/shared';
import GroupForm from './GroupForm';
import SuccessRedirector from '../../forms/SuccessRedirector';

export default function NewGroup() {
  const [newEntryId, setNewEntryId] = useState(null);
  const navigate = useNavigate();

  const createGroup = async (newGroup) => {
    try {
      const respond = await call('createGroup', newGroup);
      setNewEntryId(respond);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSuccess = () => {
    navigate(`/groups/${newEntryId}`);
  };

  return (
    <SuccessRedirector ping={newEntryId} onSuccess={handleSuccess}>
      <GroupForm onFinalize={createGroup} />
    </SuccessRedirector>
  );
}
