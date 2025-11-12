import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSetAtom } from 'jotai';

import { call } from '/imports/api/_utils/shared';
import { message } from '/imports/ui/generic/message';
import SuccessRedirector from '/imports/ui/forms/SuccessRedirector';
import { initialLoader, loaderAtom } from '/imports/ui/listing/NewEntryHandler';

import ResourceForm from './ResourceForm';

export default function NewResource() {
  const [newEntryId, setNewEntryId] = useState(null);
  const navigate = useNavigate();
  const setLoaders = useSetAtom(loaderAtom);

  const createResource = async (newResource) => {
    try {
      const respond = await call('createResource', newResource);
      setNewEntryId(respond);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const handleSuccess = () => {
    setTimeout(() => {
      setLoaders({ ...initialLoader });
      navigate(`/resources/${newEntryId}`);
    }, 1200);
  };

  return (
    <SuccessRedirector ping={newEntryId} onSuccess={handleSuccess}>
      <ResourceForm onFinalize={createResource} />
    </SuccessRedirector>
  );
}
