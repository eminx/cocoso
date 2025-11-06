import React, { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAtom } from 'jotai';

import { call } from '../../../api/_utils/shared';
import SuccessRedirector from '/imports/ui/forms/SuccessRedirector';
import { message } from '/imports/ui/generic/message';

import GroupForm from './GroupForm';
import { groupAtom } from './GroupItemHandler';

export default function EditGroup() {
  const [updated, setUpdated] = useState(null);
  const [group, setGroup] = useAtom(groupAtom);
  const [, setSearchParams] = useSearchParams();
  if (!group) {
    return null;
  }

  const updateGroup = async (newGroup) => {
    const groupId = group._id;
    try {
      await call('updateGroup', groupId, newGroup);
      setGroup(await call('getGroupWithMeetings', groupId));
      setUpdated(groupId);
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
    <SuccessRedirector
      ping={updated}
      onSuccess={() => setSearchParams({ edit: 'false' })}
    >
      <GroupForm group={groupFields} onFinalize={updateGroup} />
    </SuccessRedirector>
  );
}
