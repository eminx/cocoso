import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, MenuButton, MenuList, MenuItem, Select } from '@chakra-ui/react';

export default ChangeLanguage = ({ select, register }) => {
  const { t, i18n } = useTranslation();

  if (!select)
    return (
      <Menu>
        <MenuButton textTransform="uppercase">{i18n.language}</MenuButton>
        <MenuList>
          {i18n.languages.map((lang) => (
            <MenuItem
              key={lang}
              fontWeight={lang == i18n.language ? 'bold' : 'normal'}
              onClick={() => i18n.changeLanguage(lang)}
            >
              {t(`common:langs.${lang}`)}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    );

  return (
    <Select name="lang" {...register('lang')} placeholder={t('common:langs.form.holder')}>
      {i18n.languages.map((lang) => (
        <option key={lang} value={lang}>
          {t(`common:langs.${lang}`)}
        </option>
      ))}
    </Select>
  );
};
