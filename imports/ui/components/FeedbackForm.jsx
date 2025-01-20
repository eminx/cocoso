import React, { useState } from 'react';
import {
  Button,
  Center,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  VStack,
} from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';

import FormField from './FormField';

function FeedbackForm({ isDarkText = true }) {
  const [tc] = useTranslation('common');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  return (
    <>
      <Center p="2" data-oid=":xwr.vz">
        <Button
          color={isDarkText ? 'brand.500' : 'brand.50'}
          size="xs"
          variant="link"
          onClick={() => setShowFeedbackModal(true)}
          data-oid="1h:sv4i"
        >
          {tc('modals.feedback.label')}
        </Button>
      </Center>

      <Modal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        data-oid="ga7hq7h"
      >
        <ModalOverlay data-oid="ntdg:0w" />
        <ModalContent bg="brand.50" data-oid="4sg2800">
          <ModalHeader data-oid="i6q-ueb">{tc('modals.feedback.label')}</ModalHeader>
          <ModalCloseButton data-oid=".rvfog-" />
          <form action="https://formspree.io/f/xdopweon" method="POST" data-oid="3s8huux">
            <ModalBody data-oid="m8zcb.w">
              <VStack spacing="6" data-oid="r40ugen">
                <FormField label={tc('modals.feedback.form.email.label')} data-oid="73yfrh3">
                  <Input type="email" name="_replyto" data-oid=".pexs_m" />
                </FormField>

                <FormField label={tc('modals.feedback.form.subject.label')} data-oid="5p:tesq">
                  <Select name="subject" data-oid="cuu:tn-">
                    {[
                      tc('modals.feedback.form.subject.select.suggest'),
                      tc('modals.feedback.form.subject.select.bug'),
                      tc('modals.feedback.form.subject.select.compliment'),
                    ].map((option) => (
                      <option key={option} value={option} data-oid=".j0vc40">
                        {option}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label={tc('modals.feedback.form.details.label')} data-oid="-jp-tzp">
                  <Textarea name="message" data-oid="bypbeml" />
                </FormField>
              </VStack>
            </ModalBody>
            <ModalFooter data-oid="av8d0in">
              <Button mr={3} onClick={() => setShowFeedbackModal(false)} data-oid="d:af:76">
                {tc('actions.close')}
              </Button>
              <Button colorScheme="blue" type="submit" data-oid="bp6h0rt">
                {tc('actions.send')}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

export default FeedbackForm;
