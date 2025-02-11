import React, { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

import GroupForm from './GroupForm';
import { GroupContext } from './Group';
import { call } from '../../utils/shared';

export default function EditPublicActivity() {
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
      // message.success(t('form.success'));
      setSearchParams({ edit: 'false' });
    } catch (error) {
      console.log(error);
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
    <>
      <GroupForm group={groupFields} onFinalize={updateGroup} />
    </>
  );
}
