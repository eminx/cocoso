import React, { Fragment, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flex, Link as CLink, Text } from '@chakra-ui/react';

import { StateContext } from '../LayoutContainer';

export default function Breadcrumb({ furtherItems }) {
  const { currentHost } = useContext(StateContext);
  const location = useLocation();
  const { menu, name } = currentHost?.settings;

  const pathItems = location.pathname.split('/');
  const navItem = menu.find((item) => item.name === pathItems[1] || item.name === pathItems[2]);

  return (
    <Flex my="4">
      <Flex px="4">
        <Link to="/">
          <CLink as="span" textTransform="uppercase" fontWeight="bold">
            {name}
          </CLink>
        </Link>
        {navItem && <Text mx="2">/</Text>}
        <Link to={`/${navItem?.name}`}>
          <CLink as="span" textTransform="uppercase">
            {navItem?.label}
          </CLink>
        </Link>
        {furtherItems &&
          furtherItems.map((item) => (
            <Fragment key={item.label}>
              <Text mx="2">/</Text>
              {item.link ? (
                <Link to={item.link}>
                  <CLink as="span" textTransform="uppercase">
                    {item.label}
                  </CLink>
                </Link>
              ) : (
                <Text textTransform="uppercase">{item.label}</Text>
              )}
            </Fragment>
          ))}
      </Flex>
    </Flex>
  );
}
