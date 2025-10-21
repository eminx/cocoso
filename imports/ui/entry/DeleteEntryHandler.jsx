import React, { useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';

import Modal from '/imports/ui/core/Modal';
import { Box, Center, Text } from '/imports/ui/core';
import { StateContext } from '../LayoutContainer';
import { call } from '../utils/shared';
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
    <Modal
      confirmButtonProps={{
        colorScheme: 'red',
      }}
      confirmText={tc('modals.confirm.delete.yes')}
      id="delete-entry-handler"
      title={tc('modals.confirm.delete.title')}
      open={isOpen}
      onConfirm={() => deleteEntry()}
      onClose={() =>
        setSearchParams((params) => ({ ...params, delete: 'false' }))
      }
    >
      <Center>
        <Box>
          <Text fontSize="lg" textAlign="center">
            {tc('modals.confirm.delete.body')}
          </Text>
          <Box
            bg="red.200"
            mt="4"
            p="2"
            css={{
              borderRadius: '1rem',
              color: 'var(--cocoso-colors-red-900)',
              textAlign: 'center',
            }}
          >
            <Text fontWeight="bold" size="lg">
              {tc('modals.confirm.delete.cantundo')}
            </Text>
          </Box>
        </Box>
      </Center>
    </Modal>
  );
}
