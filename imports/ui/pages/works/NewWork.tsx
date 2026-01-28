import React, { useState } from 'react';
import { useAtomValue } from 'jotai';

import { currentUserAtom } from '/imports/state';
import { call } from '/imports/api/_utils/shared';
import { message } from '/imports/ui/generic/message';
import SuccessRedirector from '/imports/ui/forms/SuccessRedirector';

import WorkForm from './WorkForm';

export default function NewWork() {
  const [newEntryId, setNewEntryId] = useState<string | null>(null);
  const currentUser = useAtomValue(currentUserAtom);

  const createWork = async (newWork: any) => {
    try {
      const respond = await call('createWork', newWork);
      setNewEntryId(respond);
    } catch (error: any) {
      message.error(error.reason || error.error);
    }
  };

  return (
    <SuccessRedirector
      context={`@${currentUser.username}/works`}
      ping={newEntryId}
    >
      <WorkForm onFinalize={createWork} />
    </SuccessRedirector>
  );
}
