import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Flex, Heading, Input } from '@chakra-ui/react';
import ReactSelect from 'react-select';

import ComposablePageSettings from './ComposablePageSettings';

export default function TopToolBar({ composablePageTitles }) {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedPage = composablePageTitles.find((composablePage) =>
    location.pathname.includes(composablePage._id)
  );

  return (
    <Flex alignItems="space-between" my="8">
      <Box flexGrow={1}>
        <ReactSelect
          options={composablePageTitles}
          placeholder="Select a page"
          value={selectedPage}
          styles={{
            option: (styles, { data }) => ({
              ...styles,
              borderLeft: `8px solid ${data.color}`,
              paddingLeft: 6,
              fontSize: 14,
            }),
          }}
          onChange={(option) =>
            navigate(`/admin/composable-pages/${option._id}`)
          }
          getOptionValue={(option) => option._id}
          getOptionLabel={(option) => option.title}
        />
      </Box>

      <ComposablePageSettings />
    </Flex>
  );
}
