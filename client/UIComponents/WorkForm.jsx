import React from 'react';
import {
  Box,
  Button,
  TextInput,
  TextArea,
  Text,
  FormField,
  Form,
} from 'grommet';
import { Close } from 'grommet-icons';
import ReactQuill from 'react-quill';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';

import FileDropper from '../UIComponents/FileDropper';
import NiceSlider from '../UIComponents/NiceSlider';
import { editorFormats, editorModules } from '../constants/quillConfig';

const WorkForm = ({
  formValues,
  onFormChange,
  onQuillChange,
  onSubmit,
  setUploadableImages,
  images,
  imageUrl,
  buttonLabel,
  isFormValid,
  isButtonDisabled,
  onSortImages,
  onRemoveImage,
}) => {
  return (
    <div>
      <Form onSubmit={onSubmit} value={formValues} onChange={onFormChange}>
        <FormField
          label={`Images (${images.length})`}
          help={(images || imageUrl) && <Text size="small" />}
        >
          {images && <NiceSlider images={images} />}

          {images && images.length > 0 ? (
            <SortableContainer
              onSortEnd={onSortImages}
              axis="xy"
              helperClass="sortableHelper"
              pressDelay={250}
            >
              {images.map((image, index) => (
                <SortableItem
                  key={image}
                  index={index}
                  image={image}
                  onRemoveImage={() => onRemoveImage(index)}
                />
              ))}
            </SortableContainer>
          ) : (
            <Box alignSelf="center" margin={{ top: 'medium' }}>
              <FileDropper setUploadableImage={setUploadableImages} />
            </Box>
          )}
        </FormField>

        <FormField label="Title" margin={{ bottom: 'medium', top: 'medium' }}>
          <TextInput
            plain={false}
            name="title"
            placeholder="Mango Juice in Bottles..."
          />
        </FormField>

        <FormField
          label="Short description"
          margin={{ bottom: 'medium', top: 'medium' }}
        >
          <TextArea
            plain={false}
            name="shortDescription"
            placeholder="Sweet, Natural & Refreshing"
          />
        </FormField>

        <FormField label="Description" margin={{ bottom: 'medium' }}>
          <ReactQuill
            value={formValues.longDescription}
            modules={editorModules}
            formats={editorFormats}
            onChange={onQuillChange}
            placeholder="My Mango juice is handpicked from the trees and..."
          />
        </FormField>

        <FormField
          label="Additional info"
          margin={{ bottom: 'medium', top: 'medium' }}
        >
          <TextArea
            plain={false}
            name="additionalInfo"
            placeholder="A bottle costs..."
          />
        </FormField>

        <Box direction="row" justify="end" pad="small">
          <Button
            type="submit"
            primary
            label={buttonLabel}
            disabled={isButtonDisabled}
          />
        </Box>
      </Form>
    </div>
  );
};

const thumbStyle = (backgroundImage) => ({
  flexBasis: 120,
  height: 80,
  margin: 8,
  backgroundImage: `url('${backgroundImage}')`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  borderRadius: 5,
  border: '1px solid #fff',
});

const thumbIconStyle = {
  width: 24,
  height: 24,
  float: 'right',
  margin: 2,
  color: '#1b1b1b',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, .3)',
  cursor: 'pointer',
};

const SortableItem = sortableElement(({ image, onRemoveImage, index }) => {
  const onRemoveClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    onRemoveImage();
  };

  return (
    <div key={image} style={thumbStyle(image)}>
      <Close style={thumbIconStyle} onClick={onRemoveClick} />
    </div>
  );
});

const SortableContainer = sortableContainer(({ children }) => {
  return (
    <Box direction="row" justify="center" wrap>
      {children}
    </Box>
  );
});

export default WorkForm;
