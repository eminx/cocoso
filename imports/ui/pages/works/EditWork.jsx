import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { useAtom, useSetAtom } from 'jotai';

import SuccessRedirector from '/imports/ui/forms/SuccessRedirector';
import { call } from '/imports/api/_utils/shared';
import { message } from '/imports/ui/generic/message';
import { initialLoader, loaderAtom } from '/imports/ui/listing/NewEntryHandler';

import WorkForm from './WorkForm';
import { workAtom } from './WorkItemHandler';

export default function EditWork() {
  const [updated, setUpdated] = useState(null);
  const [work, setWork] = useAtom(workAtom);
  const setLoaders = useSetAtom(loaderAtom);
  const { workId, usernameSlug } = useParams();
  const [, setSearchParams] = useSearchParams();

  const username = usernameSlug.replace('@', '');

  const updateWork = async (newWork) => {
    const workId = work._id;
    try {
      await call('updateWork', workId, newWork);
      setWork(await call('getWorkById', workId, username));
      setUpdated(workId);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const handleSuccess = () => {
    setSearchParams({ edit: 'false' });
    setUpdated(null);
    setTimeout(() => {
      setLoaders({ ...initialLoader });
    }, 1200);
  };

  if (!work) {
    return null;
  }

  const workFields = (({
    additionalInfo,
    category,
    contactInfo,
    images,
    longDescription,
    shortDescription,
    showAvatar,
    title,
  }) => ({
    additionalInfo,
    category,
    contactInfo,
    images,
    longDescription,
    shortDescription,
    showAvatar,
    title,
  }))(work);

  return (
    <SuccessRedirector ping={updated} onSuccess={handleSuccess}>
      <WorkForm work={workFields} onFinalize={updateWork} />
    </SuccessRedirector>
  );
}
