import React, { useContext } from 'react';
import { Trans } from 'react-i18next';
import {
  Box,
  Button,
  Center,
  Code,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { SortableKnob } from 'react-easy-sort';
import GripHorizontal from 'lucide-react/dist/esm/icons/grip-horizontal';
import EditIcon from 'lucide-react/dist/esm/icons/edit';
import TrashIcon from 'lucide-react/dist/esm/icons/trash';
import { useDrag } from 'react-dnd';
import ReactPlayer from 'react-player';

import { ComposablePageContext } from '../ComposablePageForm';
import { Divider } from '/imports/ui/core';

function ModulePreview({ content }) {
  const renderContent = () => {
    switch (content.type) {
      case 'button':
        return <Button size="xs">{content.value?.label}</Button>;
      case 'divider':
        return <Divider />;
      case 'image':
        return <img src={content.value?.src} />;
      case 'image-slider':
        return <img src={content.value?.images[0]} />;
      case 'text':
        return (
          <Box
            dangerouslySetInnerHTML={{
              __html: content.value?.html?.substring(0, 50),
            }}
            fontSize="xs"
          />
        );
      case 'video':
        return <Code>{content.value?.src}</Code>;
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
        w="100%"
        style={{ transform: 'translateX(-14px)' }}
      >
        {renderContent()}
      </Center>
    </Box>
  );
}

export default function ContentModule(props) {
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
    <Flex
      align="center"
      cursor="grab"
      direction="column"
      ref={dragRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
      w="100%"
    >
      <Flex justify="space-between" w="100%">
        <Button
          _hover={{ bg: 'blueGray.50' }}
          colorScheme="blue"
          cursor="pointer"
          flexGrow="1"
          fontWeight="bold"
          px="2"
          rightIcon={<EditIcon size="16px" />}
          size="sm"
          variant="ghost"
          onClick={() => handleOpenContentModal(content, contentIndex)}
        >
          <Trans
            i18nKey={`admin:composable.form.types.${content.type}`}
          />
        </Button>
        <IconButton
          colorScheme="red"
          flexGrow="0"
          icon={<TrashIcon size="16px" />}
          p="2"
          size="sm"
          variant="ghost"
          onClick={() =>
            setDeleteModuleModal({
              contentIndex,
              columnIndex,
              rowIndex,
              visible: true,
              moduleType: 'content',
            })
          }
        />
      </Flex>

      <ModulePreview content={content} />

      <GripHorizontal
        size="20px"
        style={{ transform: 'translateX(-14px)' }}
      />
    </Flex>
  );
}
