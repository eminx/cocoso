import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import { Trans } from 'react-i18next';

import ConfirmModal from '/imports/ui/generic/ConfirmModal';
import { call } from '/imports/ui/utils/shared';

export default function ComposablePageSettings() {
  const [state, setState] = useState({
    settingsModalOpen: false,
  });

  const saveComposablePageSettings = async (settings) => {
    await call('composablePage.update', {
      _id: selectedPage._id,
      settings,
    });
    message.success('Settings saved');
  };

  return (
    <div>
      <Button
        flexGrow={0}
        ml="4"
        rightIcon={<SettingsIcon size="16px" />}
        variant="ghost"
        onClick={() =>
          setState((prevState) => ({
            ...prevState,
            settingsModalOpen: true,
          }))
        }
      >
        <Trans i18nKey="admin:composable.settings.title" />
      </Button>
      <ConfirmModal
        title="Settings"
        visible={state.settingsModalOpen}
        onConfirm={() => saveComposablePageSettings()}
        onCancel={() =>
          setState((prevState) => ({
            ...prevState,
            settingsModalOpen: false,
          }))
        }
      >
        Settings Form will show up here
      </ConfirmModal>
    </div>
  );
}
