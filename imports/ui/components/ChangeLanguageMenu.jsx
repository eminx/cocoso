import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Menu, MenuButton, MenuList, MenuItem, Select, Text } from '@chakra-ui/react';

export default ChangeLanguage = ({ select, register }) => {
  const { t, i18n } = useTranslation();

  if (!select)
    return (
      <Box p="4">
        <Text fontSize="sm">{t('common:langs.form.label')}:</Text>
        <Menu>
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
    <Box p="4">
      <Text fontSize="sm">{t('common:langs.form.label')}:</Text>
      <Select name="lang" {...register('lang')} placeholder={t('common:langs.form.holder')}>
        {i18n.languages.map((lang) => (
          <option key={lang} value={lang}>
            {t(`common:langs.${lang}`)}
          </option>
        ))}
      </Select>
    </Box>
  );
};
