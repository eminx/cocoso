import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactSelect from 'react-select';
import { Trans } from 'react-i18next';

import { Box, Flex, Tag } from '/imports/ui/core';

import ComposablePageSettings from './ComposablePageSettings';

export default function TopToolBar({ composablePageTitles }) {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedPage = composablePageTitles.find((composablePage) =>
    location.pathname.includes(composablePage._id)
  );

  const isPublished = selectedPage?.isPublished;

  return (
    <Flex align="center" justify="space-between" my="8">
      <Box flexGrow={1}>
        <ReactSelect
          options={composablePageTitles}
          placeholder={<Trans i18nKey="common:labels.select" />}
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

      <Tag
        colorScheme={isPublished ? 'green' : 'orange'}
        ml="4"
        variant="solid"
      >
        <Trans
          i18nKey={`admin:composable.toolbar.${
            isPublished ? 'published' : 'unpublished'
          }`}
        />
      </Tag>

      <ComposablePageSettings />
    </Flex>
  );
}
