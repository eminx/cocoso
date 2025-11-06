import React, { useState } from 'react';
import { Trans } from 'react-i18next';

import {
  Button,
  Center,
  Flex,
  Input,
  Modal,
  Select,
  Textarea,
} from '/imports/ui/core';
import FormField from '/imports/ui/forms/FormField';

const feedbackOptions = [
  {
    label: (
      <Trans i18nKey="common:modals.feedback.form.subject.select.suggest">
        Suggestion
      </Trans>
    ),
    value: 'suggestion',
  },
  {
    label: (
      <Trans i18nKey="common:modals.feedback.form.subject.select.bug">
        Bug
      </Trans>
    ),
    value: 'bug',
  },
  {
    label: (
      <Trans i18nKey="common:modals.feedback.form.subject.select.compliment">
        Compliment
      </Trans>
    ),
    value: 'compliment',
  },
];

export default function FeedbackForm({ isDarkText = false }) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  return (
    <>
      <Center p="2">
        <Button
          colorScheme="gray"
          size="sm"
          variant="ghost"
          onClick={() => setShowFeedbackModal(true)}
        >
          <Trans i18nKey="common:modals.feedback.label">Give Feedback</Trans>
        </Button>
      </Center>

      <Modal
        hideFooter
        id="feedback-form"
        open={showFeedbackModal}
        title={
          <Trans i18nKey="common:modals.feedback.label">Give Feedback</Trans>
        }
        onClose={() => setShowFeedbackModal(false)}
      >
        <form action="https://formspree.io/f/xdopweon" method="POST">
          <Flex direction="column" mb="8" gap="6">
            <FormField
              label={
                <Trans i18nKey="common:modals.feedback.form.email.label">
                  Your email address
                </Trans>
              }
            >
              <Input type="email" name="_replyto" />
            </FormField>

            <FormField
              label={
                <Trans i18nKey="common:modals.feedback.form.subject.label">
                  Subject
                </Trans>
              }
            >
              <Select name="subject">
                {feedbackOptions.map((option) => {
                  return (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  );
                })}
              </Select>
            </FormField>

            <FormField
              label={
                <Trans i18nKey="common:modals.feedback.form.details.label">
                  Message
                </Trans>
              }
            >
              <Textarea
                style={{
                  border: '2px solid var(--cocoso-colors-theme-400)',
                }}
                name="message"
                rows={10}
              />
            </FormField>

            <Flex justify="flex-end" w="100%">
              <Button type="submit">
                <Trans i18nKey="common:actions.send">Send</Trans>
              </Button>
            </Flex>
          </Flex>
        </form>
      </Modal>
    </>
  );
}
