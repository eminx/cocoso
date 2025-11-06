import React, { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAtom } from 'jotai';

import { call } from '/imports/api/_utils/shared';
import SuccessRedirector from '/imports/ui/forms/SuccessRedirector';
import { message } from '/imports/ui/generic/message';

import ResourceForm from './ResourceForm';
import { resourceAtom } from './ResourceItemHandler';

export default function EditResource() {
  const [updated, setUpdated] = useState(null);
  const [resource, setResource] = useAtom(resourceAtom);
  const [, setSearchParams] = useSearchParams();
  if (!resource) {
    return null;
  }

  const updateResource = async (newResource) => {
    const resourceId = resource._id;
    try {
      await call('updateResource', resourceId, newResource);
      setResource(await call('getResourceById', resourceId));
      setUpdated(resourceId);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const resourceFields = (({
    label,
    description,
    images,
    isCombo,
    isBookable,
    resourcesForCombo,
    title,
  }) => ({
    label,
    description,
    images,
    isCombo,
    isBookable,
    resourcesForCombo,
    title,
  }))(resource);

  return (
    <SuccessRedirector
      ping={updated}
      onSuccess={() => setSearchParams({ edit: 'false' })}
    >
      <ResourceForm resource={resourceFields} onFinalize={updateResource} />
    </SuccessRedirector>
  );
}
