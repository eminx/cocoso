import React from 'react';
import { Link } from 'react-router';

import { Center, Flex } from '/imports/ui/core';
import Boxling from '/imports/ui/pages/admin/Boxling';

export default function FeaturesWrapper() {
  return (
    <>
      <Center>
        <Flex>
          {[
            'activities',
            'calendar',
            'groups',
            'pages',
            'people',
            'resources',
            'works',
          ].map((item) => (
            <Link to={`/admin/features/${item}/menu`}>
              <Boxling>{item}</Boxling>
            </Link>
          ))}
        </Flex>
      </Center>
    </>
  );
}
