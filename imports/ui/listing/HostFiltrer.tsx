import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AutoCompleteSelect, { ActionMeta } from 'react-select';
import makeAnimated from 'react-select/animated';

import { Box, Text } from '/imports/ui/core';

const animatedComponents = makeAnimated();

interface Host {
  host: string;
  name: string;
  color?: string;
}

export interface HostFiltrerProps {
  allHosts: Host[];
  hostFilterValue?: Host | null;
  onHostFilterValueChange: (value: Host | null, meta: ActionMeta<Host>) => void;
}

export default function HostFiltrer({
  allHosts,
  hostFilterValue,
  onHostFilterValueChange,
}: HostFiltrerProps) {
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);
  const [t] = useTranslation('hosts');

  const onSelect = (value: Host | null, meta: ActionMeta<Host>) => {
    onHostFilterValueChange(value, meta);
    setSelectedHost(value);
  };

  return (
    <Box w="xs" pr="12" pt="2">
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
      />

      <Box>
        <Text fontSize="sm" mt="2">
          {t('portalHost.renderInfo', {
            hostName: selectedHost
              ? selectedHost.name
              : t('portalHost.allHosts'),
          })}
        </Text>
      </Box>
    </Box>
  );
}
