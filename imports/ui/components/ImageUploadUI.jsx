import React from 'react';
import { Box, Center, IconButton, Wrap } from '@chakra-ui/react';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import SmallCloseIcon from 'lucide-react/dist/esm/icons/x-circle';

import FileDropper from './FileDropper';

function ImageUploader({ images = [], onRemoveImage, onSortImages, onSelectImages }) {
  return (
    <Box data-oid="rf1zh4a">
      {images && images.length > 0 ? (
        <SortableContainer
          onSortEnd={onSortImages}
          axis="xy"
          helperClass="sortableHelper"
          data-oid="dn8dozs"
        >
          {images.map((image, index) => (
            <SortableItem
              key={image}
              index={index}
              image={image}
              onRemoveImage={() => onRemoveImage(index)}
              data-oid="_3uvb.1"
            />
          ))}
          <FileDropper setUploadableImage={onSelectImages} isMultiple data-oid="31oo.8_" />
        </SortableContainer>
      ) : (
        <Center data-oid="e4vsh7x">
          <FileDropper setUploadableImage={onSelectImages} isMultiple data-oid="p400sti" />
        </Center>
      )}
    </Box>
  );
}

const thumbStyle = (backgroundImage) => ({
  backgroundImage: backgroundImage && `url('${backgroundImage}')`,
});

const SortableItem = sortableElement(({ image, onRemoveImage, index }) => (
  <Box key={image} className="sortable-thumb" style={thumbStyle(image)} data-oid="rgkm5_8">
    <IconButton
      className="sortable-thumb-icon"
      colorScheme="gray.900"
      icon={<SmallCloseIcon style={{ pointerEvents: 'none' }} data-oid="6v64nk1" />}
      size="xs"
      onClick={onRemoveImage}
      style={{ position: 'absolute', top: 4, right: 4 }}
      data-oid="hgksfzp"
    />
  </Box>
));

const SortableContainer = sortableContainer(({ children }) => (
  <Center w="100%" data-oid="gmpfvya">
    <Wrap py="2" display="flex" justify="center" data-oid="6q7k7:4">
      {children}
    </Wrap>
  </Center>
));

export default ImageUploader;
