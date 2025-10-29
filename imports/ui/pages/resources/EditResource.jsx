import React, { useContext, useState } from 'react';
import { useSearchParams } from 'react-router';

import ResourceForm from './ResourceForm';
import { ResourceContext } from './ResourceItemHandler';
import { call } from '../../utils/shared';
import SuccessRedirector from '../../forms/SuccessRedirector';
import { message } from '../../generic/message';

export default function EditResource() {
  const [updated, setUpdated] = useState(null);
  const { resource, getResourceById } = useContext(ResourceContext);
  const [, setSearchParams] = useSearchParams();
  if (!resource) {
    return null;
  }

  const updateResource = async (newResource) => {
    const resourceId = resource._id;
    try {
      await call('updateResource', resourceId, newResource);
      await getResourceById(resourceId);
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
