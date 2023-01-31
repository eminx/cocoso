import React from 'react';
import { Box } from '@chakra-ui/react';
import AutoCompleteSelect from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

export default function HostFiltrer({ allHosts, hostFilterValue, onHostFilterValueChange }) {
  return (
    <Box w="sm" my="2">
      <AutoCompleteSelect
        isClearable
        onChange={onHostFilterValueChange}
        components={animatedComponents}
        value={hostFilterValue}
        options={allHosts}
        getOptionValue={(option) => option.host}
        getOptionLabel={(option) => option.name}
        style={{ width: '100%', marginTop: '1rem' }}
        styles={{
          option: (styles, { data }) => ({
            ...styles,
            borderLeft: `8px solid ${data.color}`,
            paddingLeft: 6,
          }),
        }}
      />
    </Box>
  );
}
