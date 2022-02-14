import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';

export default ChangeLanguage = () => {
  const { t, i18n } = useTranslation();
  return (
    <Menu>
      <MenuButton textTransform="uppercase">{i18n.language}</MenuButton>
      <MenuList>
        {i18n.languages.map(lang => 
          <MenuItem 
            key={lang}
            fontWeight={lang == i18n.language ? 'bold' : 'normal'}
            onClick={() => i18n.changeLanguage(lang)}
          >
            {t('common:langs.'+lang)}
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};