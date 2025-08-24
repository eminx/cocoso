import React from 'react';
import { Trans } from 'react-i18next';

import { Box, Center, Text } from '/imports/ui/core';
import Menu from '/imports/ui/generic/Menu';
import Boxling, { BoxlingColumn } from '/imports/ui/pages/admin/Boxling';

import { fontOptions } from './styleOptions';

export default function FontSelector({ handleStyleChange, selectedFont }) {
  return (
    <>
      <Text fontWeight="bold" mb="4">
        <Trans i18nKey="admin:design.fonts.body.title" />
      </Text>

      <Boxling mb="8" mt="4">
        <Center>
          <BoxlingColumn
            title={<Trans i18nKey="admin:design.fonts.body.select" />}
          >
            <Menu
              buttonLabel={
                fontOptions.find((option) => selectedFont === option.value)
                  ?.label || selectedFont
              }
              options={fontOptions}
              onSelect={(selectedOption) =>
                handleStyleChange('fontFamily', selectedOption.value)
              }
            >
              {(item) => item.label}
            </Menu>

            <Box p="2" mt="2">
              <Center>
                <p>
                  <Text fontSize="sm" textAlign="center">
                    <b>Demo:</b>
                  </Text>
                </p>
              </Center>
              <Text>
                Cocoso doesn't feature tools for spying on users for tracking
                their data. Each member of any community owns their data, and
                are free to share only as much as they wish. No information is
                shared with any third party service or organisation, the data is
                owned by the community. You run projects of your community and
                their data on your own terms.
              </Text>
            </Box>
          </BoxlingColumn>
        </Center>
      </Boxling>
    </>
  );
}
