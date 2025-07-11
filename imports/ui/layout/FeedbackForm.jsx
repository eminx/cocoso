import React, { useState } from 'react';
import {
  Button,
  Center,
  Input,
  Select,
  Textarea,
  VStack,
} from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';

import Modal from '/imports/ui/core/Modal';
import FormField from '/imports/ui/forms/FormField';

function FeedbackForm({ isDarkText = false }) {
  const [tc] = useTranslation('common');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  return (
    <>
      <Center p="2">
        <Button
          color={isDarkText ? 'brand.500' : 'brand.50'}
          size="xs"
          variant="link"
          onClick={() => setShowFeedbackModal(true)}
        >
          {tc('modals.feedback.label')}
        </Button>
      </Center>

      <Modal
        hideFooter
        open={showFeedbackModal}
        title={tc('modals.feedback.label')}
        onClose={() => setShowFeedbackModal(false)}
      >
        <form action="https://formspree.io/f/xdopweon" method="POST">
          <VStack mb="8" spacing="6">
            <FormField label={tc('modals.feedback.form.email.label')}>
              <Input type="email" name="_replyto" />
            </FormField>

            <FormField label={tc('modals.feedback.form.subject.label')}>
              <Select name="subject">
                {[
                  tc('modals.feedback.form.subject.select.suggest'),
                  tc('modals.feedback.form.subject.select.bug'),
                  tc('modals.feedback.form.subject.select.compliment'),
                ].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label={tc('modals.feedback.form.details.label')}>
              <Textarea
                style={{
                  border: '2px solid var(--cocoso-colors-theme-400)',
                }}
                name="message"
                rows={10}
              />
            </FormField>
          </VStack>
        </form>
      </Modal>
    </>
  );
}

export default FeedbackForm;
