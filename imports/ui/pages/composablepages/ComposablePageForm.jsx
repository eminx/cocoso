import React, { createContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';
import DragHandleIcon from 'lucide-react/dist/esm/icons/grip-vertical';
import SortableList, {
  SortableItem,
  SortableKnob,
} from 'react-easy-sort';
import { arrayMoveImmutable } from 'array-move';

import { call } from '/imports/ui/utils/shared';
import Boxling from '/imports/ui/pages/admin/Boxling';
import { message } from '/imports/ui/generic/message';
import Row from './components/Row';
import { rowTypes } from './constants';
import ConfirmModal from '/imports/ui/generic/ConfirmModal';
import ContentHandler from './components/ContentHandler';
import BottomToolbar from './components/BottomToolbar';
import TopToolBar from '/imports/ui/pages/composablepages/components/TopToolbar';

const getNewRow = (rowType) => {
  const selectedRowType = rowTypes.find(
    (type) => type.value === rowType
  );
  return {
    gridType: selectedRowType.value,
    columns: selectedRowType.columns,
  };
};

export const ComposablePageContext = createContext(null);

const emptyModuleModal = {
  visible: false,
  contentIndex: null,
  columnIndex: null,
  rowIndex: null,
  moduleType: null,
};

export default function ComposablePageForm({ composablePageTitles }) {
  const [currentPage, setCurrentPage] = useState(null);
  const [contentModal, setContentModal] = useState({
    open: false,
    content: null,
  });
  const [deleteModuleModal, setDeleteModuleModal] =
    useState(emptyModuleModal);
  const { composablePageId } = useParams();

  const getComposablePageById = async (id) => {
    if (!id || id === '*') {
      return;
    }

    try {
      const response = await call('getComposablePageById', id);
      setCurrentPage(response);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  useEffect(() => {
    if (!composablePageId) {
      return;
    }
    getComposablePageById(composablePageId);
  }, [composablePageId]);

  useEffect(() => {
    if (!currentPage || !currentPage.ping) {
      return;
    }

    if (
      contentModal.open &&
      ['image', 'image-slider'].includes(contentModal.content?.type) &&
      !contentModal.uploading
    ) {
      setContentModal((prevModal) => ({
        ...prevModal,
        uploading: true,
        uploaded: false,
      }));
      setCurrentPage((prevPage) => ({
        ...prevPage,
        ping: false,
      }));
      return;
    }
    updateComposablePage();
  }, [currentPage?.contentRows]);

  useEffect(() => {
    if (
      contentModal.open &&
      ['image', 'image-slider'].includes(contentModal.content?.type) &&
      contentModal.uploaded
    ) {
      handleSaveContentModal();
    }
  }, [contentModal.uploaded]);

  const handleAddRow = (rowType) => {
    const newRow = getNewRow(rowType);
    setCurrentPage((prevPage) => ({
      ...prevPage,
      contentRows: [...currentPage.contentRows, newRow],
      ping: true,
    }));
  };

  const handleSortRows = (oldIndex, newIndex) => {
    setCurrentPage((prevPage) => ({
      ...prevPage,
      contentRows: arrayMoveImmutable(
        prevPage.contentRows,
        oldIndex,
        newIndex
      ),
      ping: true,
    }));
  };

  const handleDeleteRow = () => {
    if (!deleteModuleModal || !deleteModuleModal.visible) {
      return;
    }
    const rowIndex = deleteModuleModal.rowIndex;
    setCurrentPage((prevPage) => ({
      ...prevPage,
      contentRows: prevPage.contentRows.filter(
        (_, index) => index !== rowIndex
      ),
      ping: true,
    }));
    setDeleteModuleModal(emptyModuleModal);
  };

  const handleDeleteContent = () => {
    if (!deleteModuleModal || !deleteModuleModal.visible) {
      return;
    }

    const { contentRows } = currentPage;
    const { contentIndex, columnIndex, rowIndex } = deleteModuleModal;
    const newRows = [
      ...contentRows.map((row, rIndex) => {
        if (rIndex === rowIndex) {
          return {
            ...row,
            columns: row.columns.map((column, colIndex) => {
              if (colIndex === columnIndex) {
                return column.filter(
                  (_, index) => index !== contentIndex
                );
              }
              return column;
            }),
          };
        }
        return row;
      }),
    ];
    setCurrentPage((prevPage) => ({
      ...prevPage,
      contentRows: newRows,
      ping: true,
    }));
    setDeleteModuleModal(emptyModuleModal);
  };

  const handleDeleteModule = () => {
    const { contentIndex, columnIndex, rowIndex, moduleType } =
      deleteModuleModal;
    switch (moduleType) {
      case 'row':
        handleDeleteRow();
        break;
      case 'content':
        handleDeleteContent();
        break;
      default:
        break;
    }
  };

  const handleSaveContentModal = async () => {
    if (!contentModal) {
      return;
    }

    const { content, contentIndex, columnIndex, rowIndex } =
      contentModal;

    setCurrentPage((prevPage) => ({
      ...prevPage,
      contentRows: prevPage.contentRows.map((row, rIndex) => {
        if (rIndex === rowIndex) {
          return {
            ...row,
            columns: row.columns.map((column, colIndex) => {
              if (colIndex === columnIndex) {
                return column.map((prevContent, contIndex) => {
                  if (contIndex === contentIndex) {
                    return content;
                  }
                  return prevContent;
                });
              }
              return column;
            }),
          };
        }
        return row;
      }),
      ping: true,
    }));
  };

  const updateComposablePage = async () => {
    const newPage = {
      _id: currentPage._id,
      title: currentPage.title,
      contentRows: currentPage.contentRows,
    };

    try {
      await call('updateComposablePage', newPage);
      setCurrentPage((prevPage) => ({ ...prevPage, ping: false }));
      setContentModal({ open: false, content: null });
      message.success('Special page updated successfully');
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  if (!currentPage || !composablePageId) {
    return null;
  }

  const contextValue = {
    contentModal,
    currentPage,
    deleteModuleModal,
    handleSaveContentModal,
    setContentModal,
    setCurrentPage,
    setDeleteModuleModal,
  };

  return (
    <div>
      <ComposablePageContext.Provider value={contextValue}>
        <TopToolBar composablePageTitles={composablePageTitles} />

        <Heading size="lg" my="6" textAlign="center">
          {currentPage.title}
        </Heading>

        <SortableList onSortEnd={handleSortRows}>
          {currentPage.contentRows?.map((row, rowIndex) => (
            <SortableItem key={row.gridType + rowIndex}>
              <Flex>
                <Box style={{ flexGrow: 0, flexShrink: 0 }}>
                  <SortableKnob>
                    <IconButton
                      colorScheme="gray"
                      cursor="move"
                      icon={<DragHandleIcon />}
                      p="2"
                      size="sm"
                      variant="ghost"
                    />
                  </SortableKnob>
                </Box>
                <Boxling bg="blueGray.300" flexGrow={1} mb="4" p="2">
                  <Row row={row} rowIndex={rowIndex} />
                  <Center>
                    <Button
                      colorScheme="red"
                      my="2"
                      size="xs"
                      variant="link"
                      onClick={() =>
                        setDeleteModuleModal({
                          moduleType: 'row',
                          rowIndex,
                          visible: true,
                        })
                      }
                    >
                      Remove Row
                    </Button>
                  </Center>
                </Boxling>
              </Flex>
            </SortableItem>
          ))}
        </SortableList>

        <Flex>
          <Box w="40px" style={{ flexGrow: 0, flexShrink: 0 }} />
          <Center mt="4" mb="12" flexGrow={1}>
            <Menu
              placement="bottom"
              menuButton={
                <Button size="sm" variant="outline">
                  Add Row
                </Button>
              }
              transition
              onItemClick={(event) => {
                handleAddRow(event.value);
              }}
            >
              {rowTypes.map((rowType) => (
                <MenuItem key={rowType.value} value={rowType.value}>
                  {rowType.label}
                </MenuItem>
              ))}
            </Menu>
          </Center>
        </Flex>

        <Center>
          <BottomToolbar />
        </Center>

        <ConfirmModal
          confirmButtonProps={{ isLoading: contentModal?.uploading }}
          size="xl"
          title="Add Content"
          visible={contentModal?.open}
          onConfirm={handleSaveContentModal}
          onCancel={(prevState) =>
            setContentModal({ open: false, content: null })
          }
          onOverlayClick={(prevState) =>
            setContentModal({ open: false, content: null })
          }
        >
          <ContentHandler />
        </ConfirmModal>

        <ConfirmModal
          confirmButtonProps={{ colorScheme: 'red' }}
          confirmText="Delete"
          title="Are you sure?"
          visible={deleteModuleModal.visible}
          onConfirm={() => handleDeleteModule()}
          onCancel={() => setDeleteModuleModal(emptyModuleModal)}
        >
          <Text mb="2">
            Are you sure you want to delete this module?
          </Text>
          <Text>
            If you confirm, the selected module will be deleted and
            cannot be reverted.
          </Text>
        </ConfirmModal>
      </ComposablePageContext.Provider>
    </div>
  );
}
