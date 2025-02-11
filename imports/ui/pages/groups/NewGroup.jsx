import React from 'react';
import { useNavigate } from 'react-router-dom';

import { call } from '../../utils/shared';
import GroupForm from './GroupForm';

export default function NewGroup() {
  const navigate = useNavigate();

  const createGroup = async (newGroup) => {
    try {
      const newEntryId = await call('createGroup', newGroup);
      // message.success(t('form.success'));
      navigate(`/groups/${newEntryId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <GroupForm onFinalize={createGroup} />
    </>
  );
}
