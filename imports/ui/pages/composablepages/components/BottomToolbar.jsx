import React, { useContext, useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import ExternalLinkIcon from 'lucide-react/dist/esm/icons/external-link';
import CheckIcon from 'lucide-react/dist/esm/icons/check';

import { Button, Flex, Link, Modal, Text } from '/imports/ui/core';
import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';

import { ComposablePageContext } from '../ComposablePageForm';

export default function BottomToolbar() {
  const [state, setState] = useState({
    updated: false,
    publishModalVisible: false,
  });
  const {
    currentPage,
    getComposablePageById,
    getComposablePageTitles,
  } = useContext(ComposablePageContext);

  useEffect(() => {
    if (currentPage.pingSave === false) {
      setState((prevState) => ({ ...prevState, updated: true }));
    }
    setTimeout(() => {
      setState((prevState) => ({ ...prevState, updated: false }));
    }, 3000);
  }, [currentPage?.pingSave]);

  const handlePublish = async () => {
    const getPageAndCloseModal = async () => {
      await getComposablePageById();
      await getComposablePageTitles();
      setState((prevState) => ({
        ...prevState,
        publishModalVisible: false,
      }));
    };
    try {
      if (currentPage.isPublished) {
        await call('UnpublishComposablePage', currentPage._id);
        await getPageAndCloseModal();
        message.success(
          <Trans i18nKey="admin:composable.toolbar.unpublishSuccess" />
        );
        return;
      }
      await call('publishComposablePage', currentPage._id);
      await getPageAndCloseModal();
      message.success(
        <Trans i18nKey="admin:composable.toolbar.publishSuccess" />
      );
    } catch (error) {
      console.log(error);
      message.error(error.reason || error.error);
    }
  };

  let updatedClassName = 'bottom-toolbar ';
  if (state.updated) {
    updatedClassName += 'updated';
  }

  if (!currentPage) {
    return null;
  }

  const isPublished = currentPage?.isPublished;

  return (
    <>
      <Flex
        bg="gray.900"
        borderRadius="md"
        bottom="12px"
        justify="space-between"
        p="2"
        position="fixed"
        zIndex={99}
      >
        <Flex align="center" color="green.200" mx="4">
          {state.updated ? <CheckIcon size="16" /> : null}
          <Text
            className={updatedClassName}
            fontSize="sm"
            fontWeight="bold"
            ml="1"
          >
            <Trans i18nKey="admin:composable.toolbar.updated" />
          </Text>
        </Flex>
        <Flex align="center" color="blue.200" mx="2">
          <Link
            color="blue.200"
            fontSize="sm"
            fontWeight="bold"
            href={`http://${currentPage.host}/cp/${currentPage._id}`}
            mr="1"
            target="_blank"
          >
            <Trans i18nKey="admin:composable.toolbar.preview" />
          </Link>
          <ExternalLinkIcon size="16" />
        </Flex>
        <Button
          colorScheme={isPublished ? 'orange' : 'green'}
          mx="4"
          size="sm"
          variant="solid"
          onClick={() =>
            setState((prevState) => ({
              ...prevState,
              publishModalVisible: true,
            }))
          }
        >
          <Trans
            i18nKey={`admin:composable.toolbar.${
              isPublished ? 'unpublish' : 'publish'
            }`}
          />
        </Button>
      </Flex>

      <Modal
        confirmButtonProps={{
          colorScheme: isPublished ? 'orange' : 'green',
        }}
        open={state.publishModalVisible}
        title={
          <Trans
            i18nKey={`admin:composable.toolbar.${
              isPublished ? 'modalTitleUnpublish' : 'modalTitlePublish'
            }`}
          />
        }
        onConfirm={() => handlePublish()}
        onClose={() =>
          setState((prevState) => ({
            ...prevState,
            publishModalVisible: false,
          }))
        }
      >
        <Text>
          <Trans
            i18nKey={`admin:composable.toolbar.${
              isPublished ? 'unpublishText' : 'publishText'
            }`}
          />
        </Text>
      </Modal>
    </>
  );
}
