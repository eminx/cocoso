import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Menu, MenuButton, MenuList, MenuItem, Select, Text } from '@chakra-ui/react';

export default ChangeLanguage = ({
  currentLang,
  hideHelper = false,
  isCentered = false,
  register,
  select,
  onChange,
}) => {
  const { t, i18n } = useTranslation();

  if (!select)
    return (
      <Box textAlign={isCentered ? 'center' : 'initial'}>
        {!hideHelper && <Text fontSize="sm">{t('common:langs.form.label')}:</Text>}
        <Menu placement="top">
          <MenuButton fontWeight="bold" textDecoration="underline">
            {t(`common:langs.${i18n.language}`)}
          </MenuButton>
          <MenuList>
            {i18n.languages.map((lang) => (
              <MenuItem
                key={lang}
                color="gray.700"
                fontWeight={lang == i18n.language ? 'bold' : 'normal'}
                onClick={() => i18n.changeLanguage(lang)}
              >
                {t(`common:langs.${lang}`)}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Box>
    );

  return (
    <Box>
      {!hideHelper && <Text fontSize="sm">{t('common:langs.form.label')}:</Text>}
      <Select
        name="lang"
        placeholder={t('common:langs.form.holder')}
        onChange={(e) => onChange(e.target.value)}
        {...(register && register('lang'))}
      >
        {i18n.languages.map((lang) => (
          <option key={lang} selected={lang === currentLang} value={lang}>
            {t(`common:langs.${lang}`)}
          </option>
        ))}
      </Select>
    </Box>
  );
};
