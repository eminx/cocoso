import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSetAtom } from 'jotai';

import { call } from '/imports/api/_utils/shared';
import { message } from '/imports/ui/generic/message';
import SuccessRedirector from '/imports/ui/forms/SuccessRedirector';
import { initialLoader, loaderAtom } from '/imports/ui/listing/NewEntryHandler';

import GroupForm from './GroupForm';

export default function NewGroup() {
  const [newEntryId, setNewEntryId] = useState(null);
  const navigate = useNavigate();
  const setLoaders = useSetAtom(loaderAtom);

  const createGroup = async (newGroup) => {
    try {
      const respond = await call('createGroup', newGroup);
      setNewEntryId(respond);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const handleSuccess = () => {
    setTimeout(() => {
      setLoaders({ ...initialLoader });
      navigate(`/groups/${newEntryId}`);
    }, 1200);
  };

  return (
    <SuccessRedirector ping={newEntryId} onSuccess={handleSuccess}>
      <GroupForm onFinalize={createGroup} />
    </SuccessRedirector>
  );
}
