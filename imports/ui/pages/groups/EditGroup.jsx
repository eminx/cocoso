import React, { useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import GroupForm from './GroupForm';
import { GroupContext } from './Group';
import { call } from '../../utils/shared';
import SuccessRedirector from '../../forms/SuccessRedirector';
import { message } from '../../generic/message';

export default function EditGroup() {
  const [updated, setUpdated] = useState(null);
  const { group, getGroupById } = useContext(GroupContext);
  const [, setSearchParams] = useSearchParams();
  if (!group) {
    return null;
  }

  const updateGroup = async (newGroup) => {
    const groupId = group._id;
    try {
      await call('updateGroup', groupId, newGroup);
      await getGroupById(groupId);
      setUpdated(groupId);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const groupFields = (({
    capacity,
    description,
    imageUrl,
    isPrivate,
    readingMaterial,
    title,
  }) => ({
    capacity,
    description,
    imageUrl,
    isPrivate,
    readingMaterial,
    title,
  }))(group);

  return (
    <SuccessRedirector ping={updated} onSuccess={() => setSearchParams({ edit: 'false' })}>
      <GroupForm group={groupFields} onFinalize={updateGroup} />
    </SuccessRedirector>
  );
}
