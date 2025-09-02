import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trans } from 'react-i18next';
import ArrowUpDownIcon from 'lucide-react/dist/esm/icons/arrow-up-down';
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort';
import { arrayMoveImmutable } from 'array-move';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PlusIcon from 'lucide-react/dist/esm/icons/plus';

import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  Modal,
  Text,
} from '/imports/ui/core';
import Menu from '/imports/ui/generic/Menu';
import { message } from '/imports/ui/generic/message';
import { call } from '/imports/ui/utils/shared';
import Boxling from '/imports/ui/pages/admin/Boxling';

import TopToolBar from './components/TopToolbar';
import { rowTypes } from './constants';
import ComposablePageCreator from './components/ComposablePageCreator';
import ComposablePagesListing from './components/ComposablePagesListing';
import ContentHandler from './components/ContentHandler';
import Row from './components/Row';
import BottomToolbar from './components/BottomToolbar';

const getNewRow = (rowType) => {
  const selectedRowType = rowTypes.find((type) => type.value === rowType);
  return {
    gridType: selectedRowType.value,
    columns: selectedRowType.columns,
  };
};

export const ComposablePageContext = createContext(null);

const emptyModuleModal = {
  open: false,
  contentIndex: null,
  columnIndex: null,
  rowIndex: null,
  moduleType: null,
};

const defaultEmptyContentModal = {
  open: false,
  contentIndex: null,
  columnIndex: null,
  rowIndex: null,
};

export default function ComposablePageForm({
  composablePageTitles,
  getComposablePageTitles,
}) {
  const [currentPage, setCurrentPage] = useState(null);
  const [contentModal, setContentModal] = useState(defaultEmptyContentModal);
  const [deleteModuleModal, setDeleteModuleModal] = useState(emptyModuleModal);
  const [deleteWholePageModal, setDeleteWholePageModal] = useState(false);
  const { composablePageId } = useParams();
  const navigate = useNavigate();

  const getComposablePageById = useCallback(async () => {
    if (!composablePageId || composablePageId === '*') {
      return;
    }

    try {
      const response = await call('getComposablePageById', composablePageId);
      setCurrentPage(response);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  }, [composablePageId]);

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

  const handleAddRow = (selectedRow) => {
    const newRow = getNewRow(selectedRow.value);
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
      contentRows: arrayMoveImmutable(prevPage.contentRows, oldIndex, newIndex),
      pingSave: true,
    }));
  };

  const handleDeleteRow = () => {
    if (!deleteModuleModal || !deleteModuleModal.open) {
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
    if (!deleteModuleModal || !deleteModuleModal.open) {
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
                return column.filter((_, index) => index !== contentIndex);
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

  const saveContentModal = (content) => {
    if (!contentModal.open) {
      return;
    }

    const { contentIndex, columnIndex, rowIndex } = contentModal;

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

  const cancelModalContent = () => {
    setContentModal(defaultEmptyContentModal);
  };

  const updateComposablePage = useCallback(
    async (updateTitles = false) => {
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
      } catch (error) {
        message.error(error.reason || error.error);
      }
    },
    [currentPage, getComposablePageTitles]
  );

  const deleteComposablePage = async () => {
    try {
      await call('deleteComposablePage', currentPage._id);
      await getComposablePageTitles();
      setDeleteWholePageModal(false);
      message.success(<Trans i18nKey="common:message.success.remove" />);
      navigate('/admin/composable-pages/*');
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const contextValue = useMemo(
    () => ({
      getComposablePageById,
      setContentModal,
      setCurrentPage,
      setDeleteModuleModal,
    }),
    [
      getComposablePageById,
      setContentModal,
      setCurrentPage,
      setDeleteModuleModal,
    ]
  );

  if (!currentPage && !composablePageTitles) {
    return null;
  }

  if (!composablePageId || composablePageId === '*') {
    return (
      <>
        <ComposablePageCreator
          getComposablePageTitles={getComposablePageTitles}
        />
        <ComposablePagesListing composablePageTitles={composablePageTitles} />
      </>
    );
  }

  if (!currentPage) {
    return null;
  }

  const contentIndex = contentModal?.contentIndex;
  const columnIndex = contentModal?.columnIndex;
  const rowIndex = contentModal?.rowIndex;
  const initialContent = contentModal
    ? currentPage?.contentRows[rowIndex]?.columns[columnIndex][contentIndex]
    : null;

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <ComposablePageContext.Provider value={contextValue}>
          <TopToolBar
            composablePageTitles={composablePageTitles}
            getComposablePageTitles={getComposablePageTitles}
          />

          <Heading size="lg" my="6" textAlign="center">
            {currentPage.title}
          </Heading>

          <SortableList onSortEnd={handleSortRows}>
            {currentPage.contentRows?.map((row, rowIndex) => (
              <SortableItem key={row.id || row.gridType + rowIndex}>
                <div>
                  <Flex gap="0">
                    <Box>
                      <SortableKnob>
                        <button>
                          <ArrowUpDownIcon />
                        </button>
                      </SortableKnob>
                    </Box>
                    <Box style={{ flexGrow: 1 }} mb="4" p="2">
                      <Row row={row} rowIndex={rowIndex} />

                      <Center py="4">
                        <Button
                          colorScheme="red"
                          size="xs"
                          variant="ghost"
                          onClick={() =>
                            setDeleteModuleModal({
                              moduleType: 'row',
                              rowIndex,
                              open: true,
                            })
                          }
                        >
                          <Trans i18nKey="admin:composable.form.removeRow" />
                        </Button>
                      </Center>
                    </Box>
                  </Flex>
                </div>
              </SortableItem>
            ))}
          </SortableList>

          <Flex>
            <Box w="40px" />
            <Center mt="4" mb="12" css={{ flexGrow: '1' }}>
              <Menu
                buttonLabel={<Trans i18nKey="admin:composable.form.addRow" />}
                leftIcon={<PlusIcon size="18px" />}
                options={rowTypes}
                onSelect={handleAddRow}
              >
                {(rowType) => rowType.label}
              </Menu>
            </Center>
          </Flex>

          <Modal
            confirmButtonProps={{ colorScheme: 'red' }}
            open={deleteModuleModal.open}
            title={<Trans i18nKey="admin:composable.confirmDelete.title" />}
            onConfirm={() => handleDeleteModule()}
            onClose={() => setDeleteModuleModal(emptyModuleModal)}
          >
            <Text fontWeight="bold" mb="2">
              <Trans i18nKey="admin:composable.confirmDelete.text1" />
            </Text>
            <Text>
              <Trans i18nKey="admin:composable.confirmDelete.text2" />
            </Text>
          </Modal>
        </ComposablePageContext.Provider>
      </DndProvider>

      <Center>
        <BottomToolbar
          currentPage={currentPage}
          getComposablePageById={getComposablePageById}
          getComposablePageTitles={getComposablePageTitles}
        />
      </Center>

      <Modal
        closeOnOverlayClick={false}
        hideFooter
        open={contentModal?.open}
        size="3xl"
        title={<Trans i18nKey="admin:composable.form.addContent" />}
      >
        <ContentHandler
          initialContent={initialContent}
          onConfirm={saveContentModal}
          onCancel={cancelModalContent}
        />
      </Modal>

      <Center bg="red.50" p="4" mb="8">
        <Button
          colorScheme="red"
          size="sm"
          variant="outline"
          onClick={() => setDeleteWholePageModal(true)}
        >
          <Trans i18nKey="common:actions.remove" />
        </Button>

        <Modal
          confirmButtonProps={{ colorScheme: 'red' }}
          confirmText={<Trans i18nKey="admin:pages.actions.delete" />}
          open={deleteWholePageModal}
          title={<Trans i18nKey="admin:composable.confirmDelete.title" />}
          onConfirm={deleteComposablePage}
          onClose={() => setDeleteWholePageModal(false)}
        >
          <Text fontWeight="bold" mb="2">
            <Trans i18nKey="admin:composable.confirmDelete.textWholePage" />
          </Text>
          <Text mb="2">
            <Trans i18nKey="admin:composable.confirmDelete.textWholePage2" />
          </Text>
        </Modal>
      </Center>
    </div>
  );
}
