import React, { useContext } from 'react';
import { Trans } from 'react-i18next';
import { Box, Button, Center, Code, Flex, IconButton } from '/imports/ui/core';
import { useDrag } from 'react-dnd';
import HTMLReactParser from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';
import GripHorizontal from 'lucide-react/dist/esm/icons/grip-horizontal';
import EditIcon from 'lucide-react/dist/esm/icons/edit';
import TrashIcon from 'lucide-react/dist/esm/icons/trash';

import type { Module } from '/imports/ui/entry/ComposablePageHybrid';
import { Divider } from '/imports/ui/core';
import { getImageUrl } from '/imports/ui/utils/imageHelper';

import { ComposablePageContext } from '../ComposablePageForm';

interface ModuleType {
  content: Module;
}

function ModulePreview({ content }: ModuleType) {
  const renderContent = () => {
    const value = content?.value;
    switch (content.type) {
      case 'button':
        return (
          <Button size={value?.size} variant={value?.variant}>
            {value?.label}
          </Button>
        );
      case 'divider':
        return <Divider />;
      case 'image':
        return (
          <img
            src={getImageUrl(value?.src, 'full') || value?.src}
            style={{ borderRadius: '6px' }}
          />
        );
      case 'image-slider':
        return (
          <img
            src={getImageUrl(value?.images?.[0], 'medium') || value?.images?.[0]}
            style={{ borderRadius: '6px' }}
          />
        );
      case 'text':
        return (
          <Box px="2" style={{ fontSize: '12px' }}>
            {value?.html
              ? HTMLReactParser(
                  DOMPurify.sanitize(value.html.substring(0, 100))
                )
              : null}
          </Box>
        );
      case 'video':
        return <Code>{value?.src}</Code>;
      default:
        return null;
    }
  };

  return (
    <Box w="100%">
      <Center
        bg="gray.50"
        borderRadius="md"
        my="2"
        p="1"
        style={{ transform: 'translateX(-14px)' }}
        w="100%"
      >
        {renderContent()}
      </Center>
    </Box>
  );
}

export default function ContentEditModule(props) {
  const { setContentModal, setDeleteModuleModal } = useContext(
    ComposablePageContext
  );

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'content',
    item: { ...props },
    canDrag: (monitor) => {
      return true;
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleOpenContentModal = (content, contentIndex) => {
    setContentModal({
      content,
      contentIndex,
      columnIndex,
      rowIndex,
      open: true,
    });
  };

  const { content, contentIndex, columnIndex, rowIndex } = props;

  return (
    <div style={{ width: '100%' }} ref={dragRef}>
      <Flex
        align="center"
        direction="column"
        w="100%"
        css={{
          borderRadius: '1rem',
          cursor: 'grab',
          opacity: isDragging ? 0.9 : 1,
        }}
      >
        <div style={{ width: '100%' }}>
          <Flex justify="space-between" w="100%">
            <div />
            <Center
              css={{
                flexGrow: '1',
              }}
            >
              <Button
                colorScheme="blue"
                rightIcon={<EditIcon size="16px" />}
                size="sm"
                variant="ghost"
                onClick={() => handleOpenContentModal(content, contentIndex)}
              >
                <Trans
                  i18nKey={`admin:composable.form.types.${content.type}`}
                />
              </Button>
            </Center>

            <IconButton
              colorScheme="red"
              icon={<TrashIcon size="16px" />}
              size="xs"
              variant="ghost"
              css={{
                flexGrow: '0',
              }}
              onClick={() =>
                setDeleteModuleModal({
                  contentIndex,
                  columnIndex,
                  rowIndex,
                  open: true,
                  moduleType: 'content',
                })
              }
            />
          </Flex>

          <ModulePreview content={content} />

          <Center>
            <GripHorizontal
              size="20px"
              style={{ transform: 'translateX(-14px)' }}
            />
          </Center>
        </div>
      </Flex>
    </div>
  );
}
