import React from 'react';
import i18n from 'i18next';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';

export default ChangeLanguage = () => {
  return (
    <Menu>
      <MenuButton textTransform="uppercase">{i18n.language}</MenuButton>
      <MenuList>
        {i18n.languages.map(lang => 
          <MenuItem 
            fontWeight={lang == i18n.language ? 'bold' : 'normal'}
            textTransform="uppercase" 
            onClick={() => i18n.changeLanguage(lang)}
          >
            {lang}
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};