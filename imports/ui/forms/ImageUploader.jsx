import React, { useEffect, useState } from 'react';
import { Box, Center, IconButton } from '@chakra-ui/react';
import SmallCloseIcon from 'lucide-react/dist/esm/icons/x-circle';
import SortableList, { SortableItem } from 'react-easy-sort';
import { arrayMoveImmutable } from 'array-move';

import FileDropper from './FileDropper';
import { resizeImage, uploadImage } from '../utils/shared';
import DocumentUploadHelper from './UploadHelpers';
import { message } from '../generic/message';

const thumbStyle = (backgroundImage) => ({
  backgroundImage: backgroundImage && `url('${backgroundImage}')`,
});

const parseImages = (images) => {
  if (!images || images.length === 0) {
    return [];
  }

  return images
    .filter((image) => image && image !== 'none')
    .map((image) => ({
      src: image,
      uploaded: true,
    }));
};

export default function ImageUploader({
  preExistingImages = [],
  isMultiple = true,
  ping = false,
  uploadParam = 'genericEntryImageUpload',
  onSelectImages,
  onUploadedImages,
}) {
  const [localImages, setLocalImages] = useState([]);

  useEffect(() => {
    setLocalImages(parseImages(preExistingImages));
  }, [preExistingImages]);

  const uploadImages = async () => {
    try {
      const imagesReadyToSave = await Promise.all(
        localImages.map(async (uploadableImage) => {
          if (uploadableImage.uploaded) {
            return uploadableImage.src;
          }
          const resizedImage = await resizeImage(
            uploadableImage.resizableData,
            1600
          );
          const uploadedImage = await uploadImage(
            resizedImage,
            uploadParam
          );
          return uploadedImage;
        })
      );
      if (typeof onUploadedImages === 'function') {
        onUploadedImages(imagesReadyToSave);
      }
    } catch (error) {
      console.log('Error uploading:', error);
      message.error(error.reason || error.error);
    }
  };

  useEffect(() => {
    if (ping) {
      uploadImages();
    }
  }, [ping]);

  const setUploadableImages = (files) => {
    if (!isMultiple) {
      const file = files[0];
      const reader = new FileReader();
      const onLoad = () => {
        const newLocalImages = [
          {
            src: reader.result,
            resizableData: file,
            uploaded: false,
          },
        ];
        setLocalImages(newLocalImages);
        if (typeof onSelectImages === 'function') {
          onSelectImages(newLocalImages);
        }
        reader.removeEventListener('load', onLoad);
      };

      reader.addEventListener('load', onLoad, false);
      reader.readAsDataURL(file);
      return;
    }

    files.forEach((uploadableImage) => {
      const reader = new FileReader();
      const onLoad = () => {
        setLocalImages((prevLocalImages) => {
          const newLocalImages = [
            ...prevLocalImages,
            {
              src: reader.result,
              resizableData: uploadableImage,
              uploaded: false,
            },
          ];
          if (typeof onSelectImages === 'function') {
            onSelectImages(newLocalImages);
          }
          return newLocalImages;
        });
        reader.removeEventListener('load', onLoad);
      };
      reader.addEventListener('load', onLoad, false);
      reader.readAsDataURL(uploadableImage);
    });
  };

  const handleRemoveImage = (imageIndex) => {
    setLocalImages((prevLocalImages) =>
      prevLocalImages.filter((image, index) => index !== imageIndex)
    );
  };

  const handleSortImages = (oldIndex, newIndex) => {
    if (oldIndex === newIndex) {
      return;
    }

    setLocalImages((prevLocalImages) =>
      arrayMoveImmutable(prevLocalImages, oldIndex, newIndex)
    );
  };

  if (!isMultiple) {
    return (
      <>
        <Center>
          <FileDropper
            imageUrl={
              localImages && localImages.length > 0
                ? localImages[0]?.src
                : undefined
            }
            setUploadableImage={setUploadableImages}
            isMultiple={false}
          />
        </Center>
        <DocumentUploadHelper />
      </>
    );
  }

  if (!localImages || localImages.length === 0) {
    return (
      <>
        <Center>
          <FileDropper
            setUploadableImage={setUploadableImages}
            isMultiple={isMultiple}
          />
        </Center>
        <DocumentUploadHelper />
      </>
    );
  }

  return (
    <Box>
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
            {localImages.map((image, index) => (
              <SortableItem key={image.src}>
                <Box
                  className="sortable-thumb"
                  style={thumbStyle(image.src)}
                >
                  <IconButton
                    className="sortable-thumb-icon"
                    colorScheme="gray.900"
                    icon={
                      <SmallCloseIcon
                        style={{ pointerEvents: 'none' }}
                      />
                    }
                    size="xs"
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      zIndex: 1501,
                    }}
                    onClick={() => handleRemoveImage(index)}
                  />
                </Box>
              </SortableItem>
            ))}
          </SortableList>
        </Box>
      </Center>
      <FileDropper
        setUploadableImage={setUploadableImages}
        isMultiple
      />
    </Box>
  );
}
