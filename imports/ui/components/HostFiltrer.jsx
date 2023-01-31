import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Center, Text } from '@chakra-ui/react';
import AutoCompleteSelect from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

export default function HostFiltrer({ allHosts, hostFilterValue, onHostFilterValueChange }) {
  const [selectedHost, setSelectedHost] = useState(null);
  const [t] = useTranslation('hosts');

  const onSelect = (value, meta) => {
    onHostFilterValueChange(value, meta);
    setSelectedHost(value);
  };

  return (
    <Box w="sm" my="2">
      <AutoCompleteSelect
        components={animatedComponents}
        isClearable
        options={allHosts}
        placeholder={t('portalHost.selectHost')}
        value={hostFilterValue}
        style={{ width: '100%', marginTop: '1rem' }}
        styles={{
          option: (styles, { data }) => ({
            ...styles,
            borderLeft: `8px solid ${data.color}`,
            paddingLeft: 6,
          }),
        }}
        onChange={onSelect}
        getOptionValue={(option) => option.host}
        getOptionLabel={(option) => option.name}
      />

      <Center>
        <Text fontSize="sm" mt="4">
          {t('portalHost.renderInfo', {
            hostName: selectedHost ? selectedHost.name : t('portalHost.allHosts'),
          })}
        </Text>
      </Center>
    </Box>
  );
}
