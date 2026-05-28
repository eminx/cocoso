import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';
import RightIcon from 'lucide-react/dist/esm/icons/arrow-right';

import { Box, Button, Center, Text } from '/imports/ui/core';
import { platformAtom } from '/imports/state';

export default function ShowContentFromOtherHosts({
  isPortalHost,
  listing,
}: {
  isPortalHost: boolean;
  listing: string;
}) {
  const platform = useAtomValue(platformAtom);
  const [t] = useTranslation('common');

  const showEventsFromOtherHosts =
    platform?.isFederationLayout && !isPortalHost;

  if (!showEventsFromOtherHosts) {
    return null;
  }

  return (
    <Box mb="8" mt="4">
      <Center>
        <Text size="lg">
          <Trans i18nKey="common:public.labels.more">Wanna see more?</Trans>
        </Text>
      </Center>
      <Center p="4">
        <a href={`https://${platform?.portalHost}/${listing}`}>
          <Button rightIcon={<RightIcon />} variant="outline">
            <Trans
              i18nKey="common:public.labels.portal"
              values={{ listing: t(`domains.${listing}`) }}
            >
              <span className="capitalize-first-letter">
                {listing} in the Portal
              </span>
            </Trans>
          </Button>
        </a>
      </Center>
    </Box>
  );
}
