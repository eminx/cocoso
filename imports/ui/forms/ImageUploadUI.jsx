import React from 'react';
import { Box, Center, IconButton } from '@chakra-ui/react';
import SmallCloseIcon from 'lucide-react/dist/esm/icons/x-circle';
import SortableList, { SortableItem } from 'react-easy-sort';

import FileDropper from './FileDropper';

const thumbStyle = (backgroundImage) => ({
  backgroundImage: backgroundImage && `url('${backgroundImage}')`,
});

export default function ImageUploader({
  images = [],
  onRemoveImage,
  onSortImages,
  onSelectImages,
}) {
  return (
    <Box>
      {images && images.length > 0 ? (
        <>
          <Center>
            <SortableList
              draggedItemClassName="sortable-thumb--dragged"
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 120px 120px',
                gridTemplateRows: '90px 90px 90px',
                gridGap: '8px',
              }}
              onSortEnd={onSortImages}
            >
              {images.map((image, index) => (
                <SortableItem key={image}>
                  <Box className="sortable-thumb" style={thumbStyle(image)}>
                    <IconButton
                      className="sortable-thumb-icon"
                      colorScheme="gray.900"
                      icon={<SmallCloseIcon style={{ pointerEvents: 'none' }} />}
                      size="xs"
                      style={{ position: 'absolute', top: 4, right: 4, zIndex: 1501 }}
                      onClick={() => onRemoveImage(index)}
                    />
                  </Box>
                </SortableItem>
              ))}
            </SortableList>
          </Center>
          <FileDropper setUploadableImage={onSelectImages} isMultiple />
        </>
      ) : (
        <Center>
          <FileDropper setUploadableImage={onSelectImages} isMultiple />
        </Center>
      )}
    </Box>
  );
}
