import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { call } from '../../utils/shared';
import ResourceForm from './ResourceForm';
import SuccessRedirector from '../../forms/SuccessRedirector';

export default function NewResource() {
  const [newEntryId, setNewEntryId] = useState(null);
  const navigate = useNavigate();

  const createResource = async (newResource) => {
    try {
      const respond = await call('createResource', newResource);
      setNewEntryId(respond);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSuccess = () => {
    navigate(`/resources/${newEntryId}`);
  };

  return (
    <SuccessRedirector ping={newEntryId} onSuccess={handleSuccess}>
      <ResourceForm onFinalize={createResource} />
    </SuccessRedirector>
  );
}
