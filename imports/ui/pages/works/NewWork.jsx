import React from 'react';
import { useNavigate } from 'react-router-dom';

import { call } from '../../utils/shared';
import WorkForm from './WorkForm';

export default function NewWork() {
  const navigate = useNavigate();

  const createWork = async (newWork) => {
    try {
      const newEntryId = await call('createWork', newWork);
      // message.success(t('form.success'));
      navigate(`/resources${newEntryId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <WorkForm onFinalize={createWork} />
    </>
  );
}
