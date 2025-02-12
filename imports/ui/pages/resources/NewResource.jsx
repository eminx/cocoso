import React from 'react';
import { useNavigate } from 'react-router-dom';

import { call } from '../../utils/shared';
import ResourceForm from './ResourceForm';

export default function NewResource() {
  const navigate = useNavigate();

  const createResource = async (newResource) => {
    try {
      const newEntryId = await call('createResource', newResource);
      // message.success(t('form.success'));
      navigate(`/resources/${newEntryId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ResourceForm onFinalize={createResource} />
    </>
  );
}
