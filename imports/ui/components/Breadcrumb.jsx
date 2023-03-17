import React, { Fragment, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Flex, Link as CLink, Text } from '@chakra-ui/react';

import { StateContext } from '../LayoutContainer';

export default function Breadcrumb({ furtherItems }) {
  const { currentHost } = useContext(StateContext);
  const location = useLocation();
  const { menu, name } = currentHost?.settings;

  const pathItems = location.pathname.split('/');
  const navItem =
    !pathItems.includes('admin') &&
    menu.find((item) => item.name === pathItems[1] || item.name === pathItems[2]);

  return (
    <Box my="6">
      <Flex px="4" wrap="wrap">
        <Link to="/">
          <CLink as="span" color="#06c" fontWeight="bold">
            {name}
          </CLink>
        </Link>

        {navItem && <Text mx="2">/</Text>}

        <Link to={`/${navItem?.name}`}>
          <CLink as="span" color="#06c">
            {navItem?.label}
          </CLink>
        </Link>

        {furtherItems &&
          furtherItems.map((item) => (
            <Fragment key={item.label}>
              <Text mx="2">/</Text>
              {item.link ? (
                <Link to={item.link}>
                  <CLink as="span" color="#06c">
                    {item.label}
                  </CLink>
                </Link>
              ) : (
                <Text>{item.label}</Text>
              )}
            </Fragment>
          ))}
      </Flex>
    </Box>
  );
}
