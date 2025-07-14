import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Select, Text } from '/imports/ui/core';
import { allLangs } from '/imports/startup/i18n';
import Menu from '/imports/ui/generic/Menu';

export default function ChangeLanguage({
  hideHelper = false,
  centered = false,
  register,
  select,
  onChange,
}) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <Box>
      {!hideHelper && (
        <Text fontSize="sm">{t('common:langs.form.label')}:</Text>
      )}
      <Select
        name="lang"
        placeholder={t('common:langs.form.holder')}
        onChange={
          register ? null : (e) => i18n.changeLanguage(e.target.value)
        }
        {...(register && register('lang'))}
      >
        {allLangs.map((lang) => (
          <option
            key={lang.value}
            selected={lang.value === currentLang}
            value={lang.value}
          >
            {lang.label}
          </option>
        ))}
      </Select>
    </Box>
  );
}
