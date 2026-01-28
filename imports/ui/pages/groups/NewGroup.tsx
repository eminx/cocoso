import React, { useState } from 'react';

import { call } from '/imports/api/_utils/shared';
import { message } from '/imports/ui/generic/message';
import SuccessRedirector from '/imports/ui/forms/SuccessRedirector';

import GroupForm from './GroupForm';

export default function NewGroup() {
  const [newEntryId, setNewEntryId] = useState<string | null>(null);

  const createGroup = async (newGroup: any) => {
    try {
      const respond = await call('createGroup', newGroup);
      setNewEntryId(respond);
    } catch (error: any) {
      message.error(error.reason || error.error);
    }
  };

  return (
    <SuccessRedirector context="groups" ping={newEntryId}>
      <GroupForm onFinalize={createGroup} />
    </SuccessRedirector>
  );
}
