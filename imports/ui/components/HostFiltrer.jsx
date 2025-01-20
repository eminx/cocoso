import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Text } from '@chakra-ui/react';
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
    <Box w="xs" pr="12" pt="2" data-oid="xid8nou">
      <AutoCompleteSelect
        components={animatedComponents}
        isClearable
        options={allHosts}
        placeholder={t('portalHost.selectHost')}
        value={hostFilterValue}
        styles={{
          option: (styles, { data }) => ({
            ...styles,
            borderLeft: `8px solid ${data.color}`,
            paddingLeft: 6,
            fontSize: 14,
          }),
        }}
        onChange={onSelect}
        getOptionValue={(option) => option.host}
        getOptionLabel={(option) => option.name}
        data-oid="avfg4l:"
      />

      <Box data-oid="m3wqu7e">
        <Text fontSize="sm" mt="2" data-oid="6fgqqbc">
          {t('portalHost.renderInfo', {
            hostName: selectedHost ? selectedHost.name : t('portalHost.allHosts'),
          })}
        </Text>
      </Box>
    </Box>
  );
}
