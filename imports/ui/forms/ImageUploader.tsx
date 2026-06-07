import React, { useEffect, useState } from 'react';
import SmallCloseIcon from 'lucide-react/dist/esm/icons/x-circle';
import SortableList, { SortableItem } from 'react-easy-sort';
import { arrayMoveImmutable } from 'array-move';
import toast from 'react-hot-toast';

import { Box, Center, IconButton } from '/imports/ui/core';

import FileDropper from './FileDropper';
import {
  resizeBeforeUpload,
  uploadImage,
} from '../../api/_utils/services/clientUpload';
import DocumentUploadHelper from './UploadHelpers';
import { message } from '../generic/message';

const thumbStyle = (backgroundImage?: string): React.CSSProperties => ({
  backgroundImage: backgroundImage ? `url('${backgroundImage}')` : undefined,
});

export interface ImageUploaderProps {
  preExistingImages?: string[];
  isMultiple?: boolean;
  ping?: boolean;
  /** Upload context: 'entry', 'avatar', or 'logo' */
  uploadParam?: 'entry' | 'avatar' | 'logo';
  /** Called with the image URLs after successful upload */
  onUploadedImages: (images: string[]) => void;
}

export default function ImageUploader({
  preExistingImages = [],
  isMultiple = true,
  ping = false,
  uploadParam = 'entry',
  onUploadedImages,
}: ImageUploaderProps) {
  const [localImages, setLocalImages] = useState(
    preExistingImages
      ? preExistingImages.map((image) => ({
          src: image,
          uploaded: true,
        }))
      : []
  );

  const uploadImages = async () => {
    try {
      const imagesReadyToSave = await Promise.all(
        localImages.map(async (uploadableImage) => {
          if (uploadableImage.uploaded) {
            return uploadableImage.src;
          }
          // Client-side resize as first pass for large files
          const resizedImage = await resizeBeforeUpload(
            uploadableImage.resizableData,
            1600
          );
          // Upload through server: Sharp → WebP variants → S3
          const result = await uploadImage(resizedImage!, uploadParam);
          // Return the actual stored image URL instead of the Images collection _id.
          return result.variants.full;
        })
      );
      onUploadedImages(imagesReadyToSave);
    } catch (error: any) {
      toast.dismissAll();
      message.error(error.reason || error.error);
    }
  };

  useEffect(() => {
    if (ping) {
      uploadImages();
    }
  }, [ping]);

  const setUploadableImages = (files: File[]) => {
    if (!isMultiple) {
      const file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener(
        'load',
        () => {
          setLocalImages([
            {
              src: reader.result,
              resizableData: file,
              uploaded: false,
            },
          ]);
        },
        false
      );
      return;
    }

    files.forEach((uploadableImage) => {
      const reader = new FileReader();
      reader.readAsDataURL(uploadableImage);
      reader.addEventListener(
        'load',
        () => {
          setLocalImages((prevLocalImages) => [
            ...prevLocalImages,
            {
              src: reader.result,
              resizableData: uploadableImage,
              uploaded: false,
            },
          ]);
        },
        false
      );
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

  if (!isMultiple) {
    return (
      <>
        <Center>
          <FileDropper
            imageUrl={localImages?.length > 0 ? localImages[0].src : null}
            setUploadableImage={setUploadableImages}
            isMultiple={false}
          />
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
            {localImages.map((image, index) => (
              <SortableItem key={image.src}>
                <div>
                  <Box className="sortable-thumb" style={thumbStyle(image.src)}>
                    <IconButton
                      className="sortable-thumb-icon"
                      icon={
                        <SmallCloseIcon style={{ pointerEvents: 'none' }} />
                      }
                      size="xs"
                      css={{
                        color: 'white',
                        '&:hover': {
                          color: 'var(--cocoso-colors-gray-100)',
                        },
                      }}
                      onClick={() => handleRemoveImage(index)}
                    />
                  </Box>
                </div>
              </SortableItem>
            ))}
          </SortableList>
        </Box>
      </Center>
      <FileDropper setUploadableImage={setUploadableImages} isMultiple />
    </>
  );
}
