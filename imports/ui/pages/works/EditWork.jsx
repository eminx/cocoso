import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { useAtom } from 'jotai';

import WorkForm from './WorkForm';
import { workAtom } from './WorkItemHandler';
import { call } from '../../utils/shared';
import SuccessRedirector from '../../forms/SuccessRedirector';
import { message } from '../../generic/message';

export default function EditWork() {
  const [updated, setUpdated] = useState(null);
  const [work, setWork] = useAtom(workAtom);
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
    <SuccessRedirector
      ping={updated}
      onSuccess={() => setSearchParams({ edit: 'false' })}
    >
      <WorkForm work={workFields} onFinalize={updateWork} />
    </SuccessRedirector>
  );
}
