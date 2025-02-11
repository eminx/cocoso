import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import PublicActivityForm from './PublicActivityForm';
import { call } from '../../utils/shared';

export default function NewPublicActivity() {
  const navigate = useNavigate();
  const [t] = useTranslation('activities');
  const [tc] = useTranslation('common');

  const createActivity = async (newActivity) => {
    try {
      const newEntryId = await call('createActivity', newActivity);
      // message.success(t('form.success'));
      navigate(`/activities/${newEntryId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <PublicActivityForm onFinalize={createActivity} />
    </>
  );
}
