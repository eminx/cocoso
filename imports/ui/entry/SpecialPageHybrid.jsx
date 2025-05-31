import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Trans } from 'react-i18next';

export default function WorkHybrid({ specialPage, Host }) {
  const { specialPageId } = useParams();

  if (!specialPage) {
    return null;
  }

  const thisSpecialPageInMenu = Host?.settings?.menu.find(
    (item) => item.name === specialPage.title
  );

  const url = `https://${specialPage.host}/sp/${specialPage.id}`;

  return <></>;
}
