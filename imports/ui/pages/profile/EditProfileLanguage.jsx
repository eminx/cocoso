import React, { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { Trans, useTranslation } from 'react-i18next';

import { currentUserAtom } from '/imports/state';
import { Button, Flex, Heading } from '/imports/ui/core';
import ChangeLanguage from '/imports/ui/layout/ChangeLanguageMenu';
import Boxling from '/imports/ui/pages/admin/Boxling';
import { message } from '/imports/ui/generic/message';
import { call } from '/imports/api/_utils/shared';

export default function EditProfileLanguage() {
  const currentUser = useAtomValue(currentUserAtom);
  const [lang, setLang] = useState(null);
  const [tc] = useTranslation('common');

  useEffect(() => {
    setLang(currentUser?.lang);
  }, [currentUser]);

  const handleSetLanguage = async () => {
    try {
      await call('setPreferredLanguage', lang);
      message.success(
        tc('message.success.save', {
          domain: `${tc('domains.data')}`,
        })
      );
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  return (
    <Boxling>
      <Heading mb="4" size="md">
        <Trans i18nKey="common:langs.form.label" />
      </Heading>
      <ChangeLanguage
        hideHelper
        select
        onChange={(selectedLang) => setLang(selectedLang)}
      />

      <Flex justify="flex-end" mt="4">
        <Button
          disabled={lang === currentUser.lang}
          onClick={handleSetLanguage}
        >
          <Trans i18nKey="common:actions.submit" />
        </Button>
      </Flex>
    </Boxling>
  );
}
