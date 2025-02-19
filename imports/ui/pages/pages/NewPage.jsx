import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { call } from '../../utils/shared';
import PageForm from './PageForm';
import { StateContext } from '../../LayoutContainer';
import SuccessRedirector from '../../forms/SuccessRedirector';
import { message } from '../../generic/message';

export default function NewPage() {
  const [newEntryId, setNewEntryId] = useState(null);
  const { currentUser } = useContext(StateContext);
  const navigate = useNavigate();

  const createPage = async (newPage) => {
    try {
      const respond = await call('createPage', newPage);
      setNewEntryId(respond);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const handleSuccess = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    navigate(`/info/${newEntryId}`);
  };

  return (
    <SuccessRedirector ping={newEntryId} onSuccess={handleSuccess}>
      <PageForm onFinalize={createPage} />
    </SuccessRedirector>
  );
}
