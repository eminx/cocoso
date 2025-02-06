import React, { useState } from 'react';
import { Box, Center, IconButton } from '@chakra-ui/react';
import SmallCloseIcon from 'lucide-react/dist/esm/icons/x-circle';
import SortableList, { SortableItem } from 'react-easy-sort';
import { arrayMoveImmutable } from 'array-move';

import FileDropper from './FileDropper';

const thumbStyle = (backgroundImage) => ({
  backgroundImage: backgroundImage && `url('${backgroundImage}')`,
});

export default function ImageUploader({ images = [] }) {
  const [state, setState] = useState({
    preExistingImages: images,
    uploadableImages: [],
    uploadableImagesLocal: [],
  });

  const setUploadableImages = (files) => {
    files.forEach((uploadableImage) => {
      const reader = new FileReader();
      reader.readAsDataURL(uploadableImage);
      reader.addEventListener(
        'load',
        () => {
          setState((prevState) => ({
            ...prevState,
            uploadableImages: [...prevState.uploadableImages, uploadableImage],
            uploadableImagesLocal: [...prevState.uploadableImagesLocal, reader.result],
          }));
        },
        false
      );
    });
  };

  const handleRemoveImage = (imageIndex) => {
    setState((prevState) => ({
      ...prevState,
      uploadableImages: prevState.uploadableImages.filter((image, index) => imageIndex !== index),
      uploadableImagesLocal: prevState.uploadableImagesLocal.filter(
        (image, index) => imageIndex !== index
      ),
    }));
  };

  const handleSortImages = (oldIndex, newIndex) => {
    if (oldIndex === newIndex) {
      return;
    }

    setState((prevState) => ({
      ...prevState,
      uploadableImages: arrayMoveImmutable(prevState.uploadableImages, oldIndex, newIndex),
      uploadableImagesLocal: arrayMoveImmutable(
        prevState.uploadableImagesLocal,
        oldIndex,
        newIndex
      ),
    }));
  };

  const allImagesRendered = [...state.preExistingImages, ...state.uploadableImagesLocal];

  if (!allImagesRendered || allImagesRendered.length === 0) {
    return (
      <Center>
        <FileDropper setUploadableImage={setUploadableImages} isMultiple />
      </Center>
    );
  }

  return (
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
          onSortEnd={handleSortImages}
        >
          {allImagesRendered.map((image, index) => (
            <SortableItem key={image}>
              <Box className="sortable-thumb" style={thumbStyle(image)}>
                <IconButton
                  className="sortable-thumb-icon"
                  colorScheme="gray.900"
                  icon={<SmallCloseIcon style={{ pointerEvents: 'none' }} />}
                  size="xs"
                  style={{ position: 'absolute', top: 4, right: 4, zIndex: 1501 }}
                  onClick={() => handleRemoveImage(index)}
                />
              </Box>
            </SortableItem>
          ))}
        </SortableList>
      </Center>
      <FileDropper setUploadableImage={setUploadableImages} isMultiple />
    </>
  );
}
