import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import { call } from '../../../api/_utils/shared';
import ResourceForm from './ResourceForm';
import SuccessRedirector from '../../forms/SuccessRedirector';
import { message } from '../../generic/message';

export default function NewResource() {
  const [newEntryId, setNewEntryId] = useState(null);
  const navigate = useNavigate();

  const createResource = async (newResource) => {
    try {
      const respond = await call('createResource', newResource);
      setNewEntryId(respond);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const handleSuccess = () => {
    navigate(`/resources/${newEntryId}/info`);
  };

  return (
    <SuccessRedirector ping={newEntryId} onSuccess={handleSuccess}>
      <ResourceForm onFinalize={createResource} />
    </SuccessRedirector>
  );
}
