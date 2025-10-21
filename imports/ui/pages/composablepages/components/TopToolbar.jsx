import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import ReactSelect from 'react-select';
import { Trans } from 'react-i18next';

import { Box, Center, Flex, Link as CLink, Tag } from '/imports/ui/core';

import ComposablePageSettings from './ComposablePageSettings';

export default function TopToolBar({
  composablePageTitles,
  getComposablePageTitles,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedPage = composablePageTitles.find((composablePage) =>
    location.pathname.includes(composablePage._id)
  );

  const isPublished = selectedPage?.isPublished;

  return (
    <>
      <Flex align="center" justify="space-between" pt="4" pb="6">
        <Box css={{ flexGrow: 1 }}>
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

        <Box pl="4">
          <Tag colorScheme={isPublished ? 'green' : 'orange'} variant="solid">
            <Trans
              i18nKey={`admin:composable.toolbar.${
                isPublished ? 'published' : 'unpublished'
              }`}
            />
          </Tag>
        </Box>

        <ComposablePageSettings
          getComposablePageTitles={getComposablePageTitles}
        />
      </Flex>

      {isPublished ? (
        <Center>
          <Link to="/admin/settings/menu/order">
            <CLink as="span" css={{ textAlign: 'center' }}>
              <Trans i18nKey="admin:composable.toolbar.linkToMenu" />
            </CLink>
          </Link>
        </Center>
      ) : null}
    </>
  );
}
