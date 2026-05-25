import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router';
import { Trans, useTranslation } from 'react-i18next';
import ExternalLinkIcon from 'lucide-react/dist/esm/icons/external-link';
import PencilIcon from 'lucide-react/dist/esm/icons/pencil';
import CheckIcon from 'lucide-react/dist/esm/icons/check';
import { useAtomValue } from 'jotai';

import { currentHostAtom } from '/imports/state';
import { Button, Flex, Link, Modal, Tag, Text } from '/imports/ui/core';
import { message } from '/imports/ui/generic/message';

import { call } from '/imports/api/_utils/shared';

export default function BottomToolbar({
  currentPage,
  getComposablePageById,
  isPublicView = false,
}: {
  currentPage: any;
  getComposablePageById: () => void;
  isPublicView?: boolean;
}) {
  const currentHost = useAtomValue(currentHostAtom);
  useTranslation('admin');

  const [state, setState] = useState({
    publishModalVisible: false,
    updated: false,
    updating: false,
  });

  useEffect(() => {
    if (currentPage?.pingSave === false) {
      setState((prevState) => ({ ...prevState, updated: true }));
    }
    setTimeout(() => {
      setState((prevState) => ({ ...prevState, updated: false }));
    }, 3000);
  }, [currentPage?.pingSave]);

  const handlePublish = async () => {
    setState((prevState) => ({
      ...prevState,
      updating: true,
    }));

    const getPageAndCloseModal = async () => {
      setState((prevState) => ({
        ...prevState,
        publishModalVisible: false,
        updating: false,
      }));
      await getComposablePageById();
    };

    try {
      if (currentPage.isPublished) {
        if (
          currentHost?.settings?.menu.find(
            (item) => item.name === currentPage._id
          )
        ) {
          message.error(
            <Trans i18nKey="admin:composable.toolbar.unpublishErrorPageInMenu" />
          );
          setState((prevState) => ({
            ...prevState,
            updating: false,
            publishModalVisible: false,
          }));
          return;
        }
        await call('unpublishComposablePage', currentPage._id);
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
        p="4"
        css={{
          borderRadius: 'var(--cocoso-border-radius)',
          bottom: '12px',
          boxShadow: 'var(--cocoso-box-shadow)',
          left: '50%',
          position: 'fixed',
          transform: 'translateX(-50%)',
          zIndex: '99',
        }}
      >
        {!isPublicView && (
          <Flex
            align="center"
            px="4"
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
        )}

        <Flex align="center" px="2">
          {isPublicView ? (
            <RouterLink to={`/admin/composable-pages/${currentPage._id}`}>
              <Button
                size="sm"
                variant="ghost"
                css={{ color: 'var(--cocoso-colors-blue-300)' }}
              >
                <Trans i18nKey="admin:composable.toolbar.edit" />
                <PencilIcon size="16" style={{ marginLeft: '0.25rem' }} />
              </Button>
            </RouterLink>
          ) : (
            <Link
              fontSize="sm"
              href={`http://${currentPage.host}/cp/${currentPage._id}`}
              target="_blank"
              css={{
                color: 'var(--cocoso-colors-blue-300)',
                fontWeight: 'bold',
                marginTop: '-3px',
              }}
            >
              <Trans i18nKey="admin:composable.toolbar.preview" />
              <ExternalLinkIcon
                color="var(--cocoso-colors-blue-400)"
                size="18"
                style={{ marginLeft: '0.25rem' }}
              />
            </Link>
          )}
        </Flex>

        <Tag colorScheme={isPublished ? 'green' : 'orange'} variant="solid">
          <Trans
            i18nKey={`admin:composable.toolbar.${
              isPublished ? 'published' : 'unpublished'
            }`}
          />
        </Tag>

        <Button
          // colorScheme={isPublished ? 'orange' : 'green'}
          mx="4"
          size="sm"
          variant="outline"
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
          loading: state.updating,
        }}
        id="composable-page-bottom-toolbar"
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
