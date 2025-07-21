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
  const { currentPage, getComposablePageById, getComposablePageTitles } =
    useContext(ComposablePageContext);

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
        align="center"
        bg="gray.900"
        justify="space-between"
        p="2"
        css={{
          borderRadius: 'var(--cocoso-border-radius)',
          bottom: '12px',
          position: 'fixed',
          zIndex: '99',
        }}
      >
        <Flex
          align="center"
          mx="4"
          css={{
            color: 'var(--cocoso-colors-green-200)',
          }}
        >
          {state.updated ? (
            <CheckIcon color="var(--cocoso-colors-green-200)" size="20" />
          ) : null}
          <Text
            className={updatedClassName}
            color="gray.300"
            fontSize="sm"
            fontWeight="bold"
          >
            <Trans i18nKey="admin:composable.toolbar.updated" />
          </Text>
        </Flex>
        <Flex align="center" mx="2">
          <Link
            size="sm"
            href={`http://${currentPage.host}/cp/${currentPage._id}`}
            target="_blank"
            css={{
              color: 'var(--cocoso-colors-blue-300)',
              fontWeight: 'bold',
            }}
          >
            <Trans i18nKey="admin:composable.toolbar.preview" />
            <ExternalLinkIcon
              color="var(--cocoso-colors-blue-400)"
              size="18"
              style={{ marginLeft: '0.25rem' }}
            />
          </Link>
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
