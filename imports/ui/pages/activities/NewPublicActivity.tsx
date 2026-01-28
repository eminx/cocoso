import React, { useState } from 'react';

import { call } from '/imports/api/_utils/shared';
import { message } from '/imports/ui/generic/message';
import SuccessRedirector from '/imports/ui/forms/SuccessRedirector';

import PublicActivityForm from './PublicActivityForm';

export default function NewPublicActivity() {
  const [newEntryId, setNewEntryId] = useState<string | null>(null);

  const createActivity = async (newActivity: any) => {
    try {
      const respond = await call('createActivity', newActivity);
      setNewEntryId(respond);
    } catch (error: any) {
      message.error(error.reason || error.error);
    }
  };

  return (
    <SuccessRedirector context="activities" ping={newEntryId}>
      <PublicActivityForm onFinalize={createActivity} />
    </SuccessRedirector>
  );
}
