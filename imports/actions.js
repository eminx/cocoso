import React from 'react';
import { Trans } from 'react-i18next';
import { getDefaultStore } from 'jotai';

import { call } from './api/_utils/shared';
import { message } from '/imports/ui/generic/message';
import { currentHostAtom } from '/imports/state';

const defaultStore = getDefaultStore();

export async function updateHostSettings({ values }) {
  try {
    await call('updateHostSettings', values);
    const newHost = await call('getCurrentHost');
    defaultStore.set(currentHostAtom, newHost);
    message.success(<Trans i18nKey="common:message.success.update" />);
  } catch (error) {
    message.error(error.reason);
  }
}
