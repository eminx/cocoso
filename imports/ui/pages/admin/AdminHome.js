import React from 'react';
import { Link } from 'react-router-dom';
import { Heading, Text, Wrap } from '@chakra-ui/react';
// import { Trans } from 'react-i18next';

import Boxling from './Boxling';

const shortCuts = [
  {
    label: 'Logo',
    helper: 'Set your logo for your organization',
    link: '/admin/settings/organization/logo',
  },
  {
    label: 'Info',
    helper: 'Manage your organization settings',
    link: '/admin/settings/organization/info',
  },
  {
    label: 'Footer',
    helper: 'Compose your footer',
    link: '/admin/settings/organization/footer',
  },
  {
    label: 'Menu',
    helper: 'Manage the menu of your website',
    link: '/admin/settings/menu',
  },
  {
    label: 'Generic Page settings',
    helper: 'For each different listing page feature, you can set a title, and a description',
    link: '/admin/features/activities',
  },
  {
    label: 'Automated Emails',
    helper:
      'Setup automated emails that users receive when they signup, or become verified or admin',
    link: '/admin/emails',
  },
  {
    label: 'Users',
    helper: 'Manege your users. Verify or unverify them',
    link: '/admin/users/all',
  },
  {
    label: 'Newsletter',
    helper: 'Send a newsletter to all your users',
    link: '/admin/email-newsletter',
  },
];

export default function AdminHome() {
  return (
    <Wrap spacing="4">
      {shortCuts.map((item) => (
        <Link to={item.link} key={item.label}>
          <Boxling _hover={{ bg: 'white' }} w="200px">
            <Heading color="blue.700" mb="2" size="md">
              {item.label}
            </Heading>
            <Text>{item.helper}</Text>
          </Boxling>
        </Link>
      ))}
    </Wrap>
  );
}
