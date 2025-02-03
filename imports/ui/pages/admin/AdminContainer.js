import React, { lazy, useContext } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Center,
  Code,
  Heading,
  List,
  ListItem,
  Link as CLink,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';

import { StateContext } from '../../LayoutContainer';
import ListMenu from '../../generic/ListMenu';
import { Alert } from '../../generic/message';
import { superadminMenu } from '../../utils/constants/general';
import Settings from './Settings';

const Members = lazy(() => import('./Members'));
const Emails = lazy(() => import('./Emails'));
const EmailNewsletter = lazy(() => import('./EmailNewsletter'));
const Categories = lazy(() => import('./Categories'));

function AdminMenu({ currentRoute, routes }) {
  const { currentHost, currentUser, role, platform } = useContext(StateContext);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  if (!currentHost || !currentUser || role !== 'admin') {
    return null;
  }

  const { isPortalHost } = currentHost;
  const { isSuperAdmin } = currentUser;

  return (
    <Box bg="gray.800" color="gray.50" minH="100vh" minW="280px" position="fixed">
      <Box bg="gray.700" p="4">
        <Link to="/">
          <Button
            as="span"
            color="brand.100"
            leftIcon={<ArrowLeft size="18px" />}
            size="lg"
            variant="link"
          >
            {currentHost.settings?.name}
          </Button>
          <br />
          <Code bg="gray.900" color="gray.100" size="sm">
            {currentHost.host}
          </Code>
        </Link>
      </Box>

      <Box p="4">
        <Heading size="md" mb="4">
          {t('panel')}
        </Heading>

        <List color="gray.50">
          {routes.map((item) => (
            <ListItem key={item.value} p="1">
              <Link to={item.value}>
                <CLink as="span">
                  <Text fontWeight={currentRoute.value === item.value ? 'bold' : 'normal'}>
                    {item.label}
                  </Text>
                </CLink>
              </Link>
            </ListItem>
          ))}
        </List>

        {isSuperAdmin && isPortalHost && platform && (
          <Box mb="2" mt="6">
            <Heading color="gray.50" size="sm">
              {`${platform.name} ${tc('domains.platform')}`}
            </Heading>
            <ListMenu list={superadminMenu} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default function AdminContainer() {
  const { currentUser, currentHost, role } = useContext(StateContext);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');
  const location = useLocation();

  if (!currentHost) {
    return null;
  }

  if (!currentUser || role !== 'admin') {
    return (
      <Center>
        <Alert>{tc('message.access.deny')}</Alert>
      </Center>
    );
  }

  const routes = [
    {
      label: t('settings.title'),
      value: 'settings/*',
      content: <Settings />,
    },
    {
      label: t('users.title'),
      value: 'users/*',
      content: <Members />,
    },
    {
      label: t('emails.title'),
      value: 'emails',
      content: <Emails />,
    },
    {
      label: t('newsletter.title'),
      value: 'email-newsletter',
      content: <EmailNewsletter />,
    },
    {
      label: t('categories.title'),
      value: 'categories',
      content: <Categories />,
    },
  ];

  const pathname = location?.pathname;
  const currentRoute = routes.find((r) => pathname.includes(r?.value?.split('/')[0]));

  return (
    <Box minH="100vh">
      <SimpleGrid columns={2} templateColumns="20% 40%">
        <Box>
          <AdminMenu routes={routes} currentRoute={currentRoute} />
        </Box>
        <Box p="8">
          <Heading mb="8">{currentRoute?.label}</Heading>
          <Routes>
            {routes.map((route) => (
              <Route key={route.value} path={route.value} element={route.content} />
            ))}
          </Routes>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
