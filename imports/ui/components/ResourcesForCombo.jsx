import React, { useState } from 'react';
import { Badge, Box, Button, Flex, Tag } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import Modal from './Modal';

export default function ResourcesForCombo({ resource }) {
  const [comboModal, setComboModal] = useState(false);

  const [t] = useTranslation('resources');
  const resourcesForCombo = resource?.resourcesForCombo;
  return (
    <Box my="2">
      {resource.isCombo && (
        <Button variant="link" onClick={() => setComboModal(true)}>
          <Tag size="lg">
            {t('cards.ifCombo')} ({resource.resourcesForCombo.length})
          </Tag>
        </Button>
      )}

      <Modal isOpen={Boolean(comboModal)} onClose={() => setComboModal(false)}>
        <Flex pt="1" wrap="wrap">
          {resourcesForCombo.map((res, i) => (
            <Badge
              key={res._id}
              fontSize="20px"
              mr="2"
              mb="2"
              px="2"
              textTransform="none"
              variant="solid"
            >
              {res.label}
            </Badge>
          ))}
        </Flex>
      </Modal>
    </Box>
  );
}
