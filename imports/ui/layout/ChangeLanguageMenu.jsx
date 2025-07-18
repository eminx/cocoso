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
    <Box
      bg="brand.50"
      p="2"
      css={{ borderRadius: 'var(--cocoso-border-radius)' }}
    >
      {!hideHelper && (
        <Text
          fontSize="sm"
          mb="2"
          css={{
            marginBottom: '0.5rem',
            textAlign: 'center',
          }}
        >
          {t('common:langs.form.label')}:
        </Text>
      )}
      <Select
        name="lang"
        placeholder={t('common:langs.form.holder')}
        value={currentLang}
        onChange={(e) => {
          console.log('onChange', e.target.value);
        }}
        {...(register && register('lang'))}
      >
        {allLangs.map((lang) => (
          <option
            key={lang.value}
            // selected={lang.value === currentLang}
            value={lang.value}
          >
            {lang.label}
          </option>
        ))}
      </Select>
    </Box>
  );
}
