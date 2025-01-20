import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Menu, MenuButton, MenuList, MenuItem, Select, Text } from '@chakra-ui/react';

import { allLangs } from '../../startup/i18n';

export default ChangeLanguage = ({
  hideHelper = false,
  isCentered = false,
  register,
  select,
  onChange,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  if (!select)
    return (
      <Box textAlign={isCentered ? 'center' : 'initial'} data-oid="q4h9qkv">
        {!hideHelper && (
          <Text fontSize="sm" data-oid="t1l4y2_">
            {t('common:langs.form.label')}:
          </Text>
        )}
        <Menu placement="top" data-oid="4icavd8">
          <MenuButton fontWeight="bold" textDecoration="underline" data-oid="71nok54">
            {t(`common:langs.${i18n.language}`)}
          </MenuButton>
          <MenuList data-oid="7jfksre">
            {allLangs.map((lang) => (
              <MenuItem
                key={lang.value}
                color="gray.700"
                fontWeight={lang.value === currentLang ? 'bold' : 'normal'}
                onClick={() => i18n.changeLanguage(lang.value)}
                data-oid="b4hw:fj"
              >
                {lang.label}
                {/* {t(`common:langs.${lang}`)} */}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Box>
    );

  return (
    <Box data-oid="la.y0qj">
      {!hideHelper && (
        <Text fontSize="sm" data-oid="ly2v2ak">
          {t('common:langs.form.label')}:
        </Text>
      )}
      <Select
        name="lang"
        placeholder={t('common:langs.form.holder')}
        onChange={(e) => onChange(e.target.value)}
        {...(register && register('lang'))}
        data-oid="q2wrncc"
      >
        {allLangs.map((lang) => (
          <option
            key={lang.value}
            selected={lang.value === currentLang}
            value={lang.value}
            data-oid="024svjq"
          >
            {lang.label}
            {/* {t(`common:langs.${lang}`)} */}
          </option>
        ))}
      </Select>
    </Box>
  );
};
