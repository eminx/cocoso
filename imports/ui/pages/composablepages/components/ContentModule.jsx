import React, { useContext } from 'react';
import { Trans } from 'react-i18next';
import { Box, Button, Flex, IconButton } from '@chakra-ui/react';
import { SortableKnob } from 'react-easy-sort';
import GripHorizontal from 'lucide-react/dist/esm/icons/grip-horizontal';
import EditIcon from 'lucide-react/dist/esm/icons/edit';
import TrashIcon from 'lucide-react/dist/esm/icons/trash';
import { useDrag } from 'react-dnd';

import { ComposablePageContext } from '../ComposablePageForm';

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
      <GripHorizontal
        size="20px"
        style={{ transform: 'translateX(-14px)' }}
      />
    </Flex>
  );
}
