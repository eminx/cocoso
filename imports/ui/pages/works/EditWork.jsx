import React, { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

import WorkForm from './WorkForm';
import { WorkContext } from './Work';
import { call } from '../../utils/shared';

export default function EditWork() {
  const { work, getWorkById } = useContext(WorkContext);
  const [, setSearchParams] = useSearchParams();
  if (!work) {
    return null;
  }

  const updateWork = async (newWork) => {
    const workId = work._id;
    try {
      await call('updateWork', workId, newWork);
      await getWorkById(workId);
      // message.success(t('form.success'));
      setSearchParams({ edit: 'false' });
    } catch (error) {
      console.log(error);
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

  return (
    <>
      <WorkForm work={workFields} onFinalize={updateWork} />
    </>
  );
}
