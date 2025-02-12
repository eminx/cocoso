import React, { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

import ResourceForm from './ResourceForm';
import { ResourceContext } from './Resource';
import { call } from '../../utils/shared';

export default function EditResource() {
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
      // message.success(t('form.success'));
      setSearchParams({ edit: 'false' });
    } catch (error) {
      console.log(error);
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
    <>
      <ResourceForm resource={resourceFields} onFinalize={updateResource} />
    </>
  );
}
