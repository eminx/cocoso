import React, { createContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { Trans } from 'react-i18next';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';
import ArrowUpDownIcon from 'lucide-react/dist/esm/icons/arrow-up-down';
import SortableList, {
  SortableItem,
  SortableKnob,
} from 'react-easy-sort';
import { arrayMoveImmutable } from 'array-move';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { call } from '/imports/ui/utils/shared';
import Boxling from '/imports/ui/pages/admin/Boxling';
import { message } from '/imports/ui/generic/message';
import Row from './components/Row';
import { rowTypes } from './constants';
import ConfirmModal from '/imports/ui/generic/ConfirmModal';
import ContentHandler from './components/ContentHandler';
import BottomToolbar from './components/BottomToolbar';
import TopToolBar from '/imports/ui/pages/composablepages/components/TopToolbar';
import ComposablePageCreator from './components/ComposablePageCreator';
import ComposablePagesListing from './components/ComposablePagesListing';

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

export default function ComposablePageForm({
  composablePageTitles,
  getComposablePageTitles,
}) {
  const [currentPage, setCurrentPage] = useState(null);
  const [contentModal, setContentModal] = useState({
    open: false,
    content: null,
  });
  const [deleteModuleModal, setDeleteModuleModal] =
    useState(emptyModuleModal);
  const [deleteWholePageModal, setDeleteWholePageModal] =
    useState(false);
  const { composablePageId } = useParams();
  const navigate = useNavigate();

  const getComposablePageById = async () => {
    if (!composablePageId || composablePageId === '*') {
      return;
    }

    try {
      const response = await call(
        'getComposablePageById',
        composablePageId
      );
      setCurrentPage(response);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  useEffect(() => {
    if (!composablePageId) {
      return;
    }
    getComposablePageById();
  }, [composablePageId]);

  useEffect(() => {
    if (!currentPage || !currentPage.pingSave) {
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
      saveContentModal();
    }
  }, [contentModal.uploaded]);

  const handleAddRow = (rowType) => {
    const newRow = getNewRow(rowType);
    setCurrentPage((prevPage) => ({
      ...prevPage,
      contentRows: [
        ...currentPage.contentRows,
        { ...newRow, id: Date.now().toString() },
      ],
      pingSave: true,
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
      pingSave: true,
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
      pingSave: true,
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
      pingSave: true,
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

  const saveContentModal = () => {
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
      pingSave: true,
    }));
  };

  const confirmContentModal = () => {
    if (
      contentModal.open &&
      ['image', 'image-slider'].includes(contentModal.content?.type)
    ) {
      setContentModal((prevModal) => ({
        ...prevModal,
        uploading: true,
        uploaded: false,
      }));
      return;
    }
    saveContentModal();
  };

  const updateComposablePage = async (updateTitles = false) => {
    const newPage = {
      _id: currentPage._id,
      title: currentPage.title,
      contentRows: currentPage.contentRows,
      settings: currentPage.settings,
    };

    try {
      await call('updateComposablePage', newPage);
      if (updateTitles) {
        await getComposablePageTitles();
      }
      setCurrentPage((prevPage) => ({ ...prevPage, pingSave: false }));
      setContentModal({ open: false, content: null });
      message.success(
        <Trans
          i18nKey="common:message.success.save"
          tOptions={{ domain: 'page' }}
        />
      );
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const deleteComposablePage = async () => {
    try {
      await call('deleteComposablePage', currentPage._id);
      await getComposablePageTitles();
      setDeleteWholePageModal(false);
      message.success(
        <Trans i18nKey="common:message.success.remove" />
      );
      navigate('/admin/composable-pages/*');
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  if (!currentPage && !composablePageId) {
    return null;
  }

  if (!composablePageId || composablePageId === '*') {
    return (
      <>
        <ComposablePageCreator
          getComposablePageTitles={getComposablePageTitles}
        />
        <ComposablePagesListing
          composablePageTitles={composablePageTitles}
        />
      </>
    );
  }

  if (!currentPage) {
    return null;
  }

  const contextValue = {
    contentModal,
    currentPage,
    deleteModuleModal,
    getComposablePageById,
    getComposablePageTitles,
    saveContentModal,
    setContentModal,
    setCurrentPage,
    setDeleteModuleModal,
    updateComposablePage,
  };

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <ComposablePageContext.Provider value={contextValue}>
          <TopToolBar composablePageTitles={composablePageTitles} />

          <Heading size="lg" my="6" textAlign="center">
            {currentPage.title}
          </Heading>

          <SortableList onSortEnd={handleSortRows}>
            {currentPage.contentRows?.map((row, rowIndex) => (
              <SortableItem key={row.id || row.gridType + rowIndex}>
                <Flex>
                  <Box style={{ flexGrow: 0, flexShrink: 0 }}>
                    <SortableKnob>
                      <IconButton
                        colorScheme="gray"
                        cursor="move"
                        icon={<ArrowUpDownIcon />}
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
                        <Trans i18nKey="admin:composable.form.removeRow" />
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
                    <Trans i18nKey="admin:composable.form.addRow" />
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

          <Center boxShadow="2xl">
            <BottomToolbar />
          </Center>

          <ConfirmModal
            confirmButtonProps={{ isLoading: contentModal?.uploading }}
            size="4xl"
            title={<Trans i18nKey="admin:composable.form.addContent" />}
            visible={contentModal?.open}
            onConfirm={confirmContentModal}
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
            title={
              <Trans i18nKey="admin:composable.confirmDelete.title" />
            }
            visible={deleteModuleModal.visible}
            onConfirm={() => handleDeleteModule()}
            onCancel={() => setDeleteModuleModal(emptyModuleModal)}
          >
            <Text fontWeight="bold" mb="2">
              <Trans i18nKey="admin:composable.confirmDelete.text1" />
            </Text>
            <Text>
              <Trans i18nKey="admin:composable.confirmDelete.text2" />
            </Text>
          </ConfirmModal>
        </ComposablePageContext.Provider>
      </DndProvider>

      <Center bg="red.50" p="4" mb="8">
        <Button
          colorScheme="red"
          size="sm"
          variant="outline"
          onClick={() => setDeleteWholePageModal(true)}
        >
          Delete
        </Button>

        <ConfirmModal
          confirmButtonProps={{ colorScheme: 'red' }}
          confirmText={<Trans i18nKey="admin:pages.actions.delete" />}
          title={
            <Trans i18nKey="admin:composable.confirmDelete.title" />
          }
          visible={deleteWholePageModal}
          onConfirm={deleteComposablePage}
          onCancel={() => setDeleteWholePageModal(false)}
        >
          <Text fontWeight="bold" mb="2">
            <Trans i18nKey="admin:composable.confirmDelete.textWholePage" />
          </Text>
          <Text mb="2">
            <Trans i18nKey="admin:composable.confirmDelete.textWholePage2" />
          </Text>
        </ConfirmModal>
      </Center>
    </div>
  );
}
