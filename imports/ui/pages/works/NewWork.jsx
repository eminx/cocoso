import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAtomValue, useSetAtom } from 'jotai';

import { currentUserAtom } from '/imports/state';
import { call } from '/imports/api/_utils/shared';
import { message } from '/imports/ui/generic/message';
import SuccessRedirector from '/imports/ui/forms/SuccessRedirector';
import { initialLoader, loaderAtom } from '/imports/ui/listing/NewEntryHandler';

import WorkForm from './WorkForm';

export default function NewWork() {
  const [newEntryId, setNewEntryId] = useState(null);
  const currentUser = useAtomValue(currentUserAtom);
  const navigate = useNavigate();
  const setLoaders = useSetAtom(loaderAtom);

  const createWork = async (newWork) => {
    try {
      const respond = await call('createWork', newWork);
      setNewEntryId(respond);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const handleSuccess = () => {
    setTimeout(() => {
      setLoaders({ ...initialLoader });
      navigate(`/@${currentUser.username}/works/${newEntryId}`);
    }, 1200);
  };

  return (
    <SuccessRedirector ping={newEntryId} onSuccess={handleSuccess}>
      <WorkForm onFinalize={createWork} />
    </SuccessRedirector>
  );
}
