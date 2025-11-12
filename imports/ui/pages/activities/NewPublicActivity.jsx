import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSetAtom } from 'jotai';

import { call } from '/imports/api/_utils/shared';
import { message } from '/imports/ui/generic/message';
import SuccessRedirector from '/imports/ui/forms/SuccessRedirector';
import { initialLoader, loaderAtom } from '/imports/ui/listing/NewEntryHandler';

import PublicActivityForm from './PublicActivityForm';

export default function NewPublicActivity() {
  const [newEntryId, setNewEntryId] = useState(null);
  const navigate = useNavigate();
  const setLoaders = useSetAtom(loaderAtom);

  const createActivity = async (newActivity) => {
    try {
      const respond = await call('createActivity', newActivity);
      setNewEntryId(respond);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const handleSuccess = () => {
    setTimeout(() => {
      setLoaders({ ...initialLoader });
      navigate(`/activities/${newEntryId}`);
    }, 1200);
  };

  return (
    <SuccessRedirector ping={newEntryId} onSuccess={handleSuccess}>
      <PublicActivityForm onFinalize={createActivity} />
    </SuccessRedirector>
  );
}
