import React from 'react';
import { Trans } from 'react-i18next';

import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';

export async function updateHostSettings({ values }) {
  try {
    await call('updateHostSettings', values);
    message.success(<Trans i18nKey="common:message.success.update" />);
  } catch (error) {
    message.error(error.reason);
  }
}
