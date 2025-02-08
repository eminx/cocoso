import React, { useEffect, useState } from 'react';
import { Box, Center, IconButton } from '@chakra-ui/react';
import SmallCloseIcon from 'lucide-react/dist/esm/icons/x-circle';
import SortableList, { SortableItem } from 'react-easy-sort';
import { arrayMoveImmutable } from 'array-move';

import FileDropper from './FileDropper';
import { resizeImage, uploadImage } from '../utils/shared';
import DocumentUploadHelper from './UploadHelpers';

const thumbStyle = (backgroundImage) => ({
  backgroundImage: backgroundImage && `url('${backgroundImage}')`,
});

export default function ImageUploader({
  images = [],
  isMultiple = true,
  ping = false,
  uploadParam = 'genericEntryImageUpload',
  onUploadedImages,
}) {
  const [state, setState] = useState({
    preExistingImages: images,
    uploadableImages: [],
    uploadableImagesLocal: [],
  });

  const uploadImages = async () => {
    const { uploadableImages } = state;

    try {
      const imagesReadyToSave = await Promise.all(
        uploadableImages.map(async (uploadableImage) => {
          const resizedImage = await resizeImage(uploadableImage, 1200);
          const uploadedImage = await uploadImage(resizedImage, uploadParam);
          return uploadedImage;
        })
      );
      onUploadedImages(imagesReadyToSave);
    } catch (error) {
      console.log('Error uploading:', error);
      // message.error(error.reason);
    }
  };

  useEffect(() => {
    if (ping) {
      uploadImages();
    }
  }, [ping]);

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
      <>
        <Center>
          <FileDropper setUploadableImage={setUploadableImages} isMultiple />
        </Center>
        <DocumentUploadHelper />
      </>
    );
  }

  return (
    <>
      <Center>
        <Box w="100%">
          <SortableList
            draggedItemClassName="sortable-thumb--dragged"
            style={{
              display: 'flex',
              flexBasis: '130px',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
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
        </Box>
      </Center>
      <FileDropper setUploadableImage={setUploadableImages} isMultiple={isMultiple} />
    </>
  );
}
