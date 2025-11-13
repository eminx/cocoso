import React, { useState } from 'react';
import { useAtom } from 'jotai';

import { call } from '/imports/api/_utils/shared';
import SuccessRedirector from '/imports/ui/forms/SuccessRedirector';
import { message } from '/imports/ui/generic/message';

import GroupForm from './GroupForm';
import { groupAtom } from './GroupItemHandler';

export default function EditGroup() {
  const [updated, setUpdated] = useState(null);
  const [group, setGroup] = useAtom(groupAtom);

  const updateGroup = async (newGroup) => {
    const groupId = group._id;
    try {
      await call('updateGroup', groupId, newGroup);
      setGroup(await call('getGroupWithMeetings', groupId));
      setUpdated(groupId);
      setTimeout(() => {
        setUpdated(null);
      }, 1000);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  if (!group) {
    return null;
  }

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
    <SuccessRedirector forEdit ping={updated}>
      <GroupForm group={groupFields} onFinalize={updateGroup} />
    </SuccessRedirector>
  );
}
