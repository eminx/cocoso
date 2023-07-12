import React, { Fragment, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Flex, Link as CLink, Text } from '@chakra-ui/react';

import { StateContext } from '../LayoutContainer';

export default function Breadcrumb({ furtherItems, ...otherProps }) {
  const { currentHost, isDesktop } = useContext(StateContext);
  const location = useLocation();
  const { menu, name } = currentHost?.settings;

  const pathItems = location.pathname.split('/');
  const navItem =
    !pathItems.includes('admin') &&
    menu.find((item) => item.name === pathItems[1] || item.name === pathItems[2]);

  return (
    <Box fontSize="130%" {...otherProps}>
      <Flex wrap="wrap">
        <Link to="/">
          <CLink as="span" fontWeight="bold">
            {name}
          </CLink>
        </Link>

        {navItem && <Text mx="2">/</Text>}

        <Link to={`/${navItem?.name}`}>
          <CLink as="span">{navItem?.label}</CLink>
        </Link>

        {!furtherItems && <Text mx="2">/</Text>}

        {furtherItems &&
          furtherItems.map((item) => (
            <Fragment key={item.label}>
              <Text mx="2">/</Text>
              {item.link ? (
                <Link to={item.link}>
                  <CLink as="span">{item.label}</CLink>
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
