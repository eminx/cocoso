import React, { useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import WorkForm from './WorkForm';
import { WorkContext } from './Work';
import { call } from '../../utils/shared';
import SuccessRedirector from '../../forms/SuccessRedirector';
import { message } from '../../generic/message';

export default function EditWork() {
  const [updated, setUpdated] = useState(null);
  const { work, getWorkById } = useContext(WorkContext);
  const [, setSearchParams] = useSearchParams();

  const updateWork = async (newWork) => {
    const workId = work._id;

    try {
      await call('updateWork', workId, newWork);
      await getWorkById(workId);
      setUpdated(workId);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

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

  if (!work) {
    return null;
  }

  return (
    <SuccessRedirector ping={updated} onSuccess={() => setSearchParams({ edit: 'false' })}>
      <WorkForm work={workFields} onFinalize={updateWork} />
    </SuccessRedirector>
  );
}
