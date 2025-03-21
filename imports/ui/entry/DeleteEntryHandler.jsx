import React, { useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Center, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { StateContext } from '../LayoutContainer';
import { call } from '../utils/shared';
import ConfirmModal from '../generic/ConfirmModal';
import { message } from '../generic/message';

function getDeleteMethod(context) {
  switch (context) {
    case 'activities':
      return 'deleteActivity';
    case 'groups':
      return 'deleteGroup';
    case 'resources':
      return 'deleteResource';
    case 'works':
      return 'deleteWork';
    case 'info':
      return 'deletePage';
    default:
      return null;
  }
}

export default function DeleteEntryHandler({ item, context }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tc] = useTranslation('common');

  const { canCreateContent, currentUser, role } = useContext(StateContext);

  const deleteEntry = async () => {
    const deleteMethod = getDeleteMethod(context);
    if (!deleteMethod) {
      return;
    }
    try {
      await call(deleteMethod, item._id);
      message.success(tc('message.success.remove'));
      navigate(`/${context}`);
      if (context === 'info') {
        window.location.reload();
      }
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  if (!canCreateContent) {
    return null;
  }

  if (context === 'resources') {
    if (currentUser._id !== item?.userId && role !== 'admin') {
      return null;
    }
  } else if (currentUser._id !== item?.authorId && role !== 'admin') {
    return null;
  }

  const isOpen = searchParams.get('delete') === 'true';

  return (
    <ConfirmModal
      confirmButtonProps={{
        colorScheme: 'red',
      }}
      confirmText={tc('modals.confirm.delete.yes')}
      title={tc('modals.confirm.delete.title')}
      visible={isOpen}
      onConfirm={() => deleteEntry()}
      onCancel={() => setSearchParams((params) => ({ ...params, delete: 'false' }))}
    >
      <Text fontSize="xl" mb="2">
        {tc('modals.confirm.delete.body')}
      </Text>
      <Center bg="red.200" borderRadius="lg" color="red.900" p="2" textAlign="center">
        <Text fontSize="lg">{tc('modals.confirm.delete.cantundo')}</Text>
      </Center>
    </ConfirmModal>
  );
}
