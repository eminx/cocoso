import React, { useState } from 'react';

import { call } from '/imports/api/_utils/shared';
import { message } from '/imports/ui/generic/message';
import SuccessRedirector from '/imports/ui/forms/SuccessRedirector';

import ResourceForm from './ResourceForm';

export default function NewResource() {
  const [newEntryId, setNewEntryId] = useState<string | null>(null);

  const createResource = async (newResource: any) => {
    try {
      const respond = await call('createResource', newResource);
      setNewEntryId(respond);
    } catch (error: any) {
      message.error(error.reason || error.error);
    }
  };

  return (
    <SuccessRedirector context="resources" ping={newEntryId}>
      <ResourceForm onFinalize={createResource} />
    </SuccessRedirector>
  );
}
