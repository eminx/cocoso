import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';

import {
  currentHostAtom,
  currentUserAtom,
  platformAtom,
  roleAtom,
} from '/imports/state';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Heading,
  Divider,
  Modal,
  Text,
} from '/imports/ui/core';
import { message } from '/imports/ui/generic/message';
import Boxling from '/imports/ui/pages/admin/Boxling';
import { call } from '/imports/api/_utils/shared';

import { subSpanStyle } from './EditProfile';
import { useNavigate } from 'react-router';

export default function EditProfilePrivacy() {
  const currentUser = useAtomValue(currentUserAtom);
  const currentHost = useAtomValue(currentHostAtom);
  const role = useAtomValue(roleAtom);
  const platform = useAtomValue(platformAtom);
  const [isLeaveModalOn, setIsLeaveModalOn] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [t] = useTranslation('accounts');
  const [tc] = useTranslation('common');
  const navigate = useNavigate();

  const setProfilePublic = async (isPublic) => {
    try {
      await call('setProfilePublic', isPublic);
      message.success(
        tc('message.success.save', {
          domain: `${tc('domains.profile')}`,
        })
      );
    } catch (error) {
      message.error(error.reason);
    }
  };

  const setProfilePublicGlobally = async (isPublic) => {
    try {
      await call('setProfilePublicGlobally', isPublic);
      message.success(
        tc('message.success.save', {
          domain: `${tc('domains.profile')}`,
        })
      );
    } catch (error) {
      message.error(error.reason);
    }
  };

  const leaveHost = async () => {
    setIsLeaving(true);
    try {
      await call('leaveHost');
      message.success(
        tc('message.success.leave', {
          host: currentHost?.settings?.name,
        })
      );
      Meteor.logout();
      navigate('/');
      setIsLeaveModalOn(false);
    } catch (error) {
      message.error(error.reason);
    } finally {
      setIsLeaving(false);
    }
  };

  const isMember = ['admin', 'contributor', 'participant'].includes(role);
  const currentMembership = currentUser?.memberships?.find(
    (m) => m.host === currentHost.host
  );
  console.log('currentMembership:', currentMembership);

  const isUserPublic = Boolean(currentMembership?.isPublic);
  const isUserPublicGlobally = currentUser?.isPublic;
  console.log('is publis globally:', isUserPublicGlobally);
  const communityName = currentHost?.settings?.name;

  const { username } = currentUser;

  return (
    <>
      <Boxling>
        <Box mb="4">
          <Heading size="md" pb="2">
            {platform?.name}{' '}
            <span style={subSpanStyle}>{tc('domains.platform')}</span>
          </Heading>
          <Checkbox
            checked={isUserPublicGlobally}
            id="is-user-public-globally"
            onChange={({ target: { checked } }) =>
              setProfilePublicGlobally(checked)
            }
          >
            {t('profile.makePublic.labelGlobal')}
          </Checkbox>
          <p>
            <Text fontSize="sm" my="2">
              {t('profile.makePublic.helperGlobal')}
            </Text>
          </p>
        </Box>

        <Divider my="4" />

        <Box pt="2">
          <Heading size="md" pb="2">
            {communityName}{' '}
            <span style={subSpanStyle}>{tc('domains.community')}</span>
          </Heading>

          <Alert bg="white" type="info" css={{ marginBottom: '0.4rem' }}>
            <Text fontSize="sm">
              <Trans
                i18nKey="accounts:profile.message.role"
                defaults="You as <bold>{{ username }}</bold> are part of {{ host }} with the <bold>{{ role }}</bold> role"
                values={{
                  host: communityName,
                  role,
                  username,
                }}
                components={{ bold: <strong /> }}
              />
            </Text>
          </Alert>

          <Box py="4">
            <Checkbox
              checked={isUserPublic}
              disabled={!isUserPublicGlobally || currentHost.isPortalHost}
              id="is-user-public-locally"
              onChange={({ target: { checked } }) => setProfilePublic(checked)}
            >
              {t('profile.makePublic.label')}
            </Checkbox>
            <p>
              <Text fontSize="sm" my="2">
                {t('profile.makePublic.helper')}
              </Text>
            </p>
          </Box>

          <Box py="2">
            <Button
              colorScheme="red"
              size="sm"
              onClick={() => setIsLeaveModalOn(true)}
            >
              {t('actions.leave', { host: communityName })}
            </Button>
          </Box>
        </Box>
      </Boxling>

      <Modal
        id="edit-profile-leave-confirm"
        open={isLeaveModalOn}
        title={t('leave.title')}
        confirmText={t('leave.label')}
        confirmButtonProps={{
          colorScheme: 'red',
          isLoading: isLeaving,
        }}
        onConfirm={leaveHost}
        onClose={() => setIsLeaveModalOn(false)}
      >
        <Text>{t('leave.body')}</Text>
      </Modal>
    </>
  );
}
