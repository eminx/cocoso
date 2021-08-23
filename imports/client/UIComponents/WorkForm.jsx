import React from 'react';
import {
  Box,
  Button,
  TextInput,
  TextArea,
  Text,
  FormField,
  Form,
  Select,
} from 'grommet';
import { Trash } from 'grommet-icons/icons/Trash';
import ReactQuill from 'react-quill';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';

import FileDropper from '../UIComponents/FileDropper';
import NiceSlider from '../UIComponents/NiceSlider';
import { editorFormats, editorModules } from '../constants/quillConfig';

function WorkForm({
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
  categories,
}) {
  return (
    <Box pad="medium" background="white">
      <Form onSubmit={onSubmit} value={formValues} onChange={onFormChange}>
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

        <FormField
          label="Category"
          margin={{ bottom: 'medium', top: 'medium' }}
        >
          <Select
            name="category"
            options={categories.map((cat) => cat.label.toUpperCase())}
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

        <FormField
          label={`Images (${images.length})`}
          help={(images || imageUrl) && <Text size="small" />}
        >
          <Box>
            {images && <NiceSlider images={images} />}

            {images && images.length > 0 ? (
              <SortableContainer
                onSortEnd={onSortImages}
                axis="xy"
                helperClass="sortableHelper"
              >
                {images.map((image, index) => (
                  <SortableItem
                    key={image}
                    index={index}
                    image={image}
                    onRemoveImage={() => onRemoveImage(index)}
                  />
                ))}
                <Box width="100%">
                  <Box alignSelf="center" margin={{ top: 'medium' }}>
                    <FileDropper setUploadableImage={setUploadableImages} />
                  </Box>
                </Box>
              </SortableContainer>
            ) : (
              <Box alignSelf="center" margin={{ top: 'medium' }}>
                <FileDropper setUploadableImage={setUploadableImages} />
              </Box>
            )}
          </Box>
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
    </Box>
  );
}

const thumbStyle = (backgroundImage) => ({
  backgroundImage: backgroundImage && `url('${backgroundImage}')`,
});

const thumbIconStyle = {
  padding: 8,
  borderRadius: 4,
  backgroundColor: 'rgba(255, 255, 255, .3)',
  zIndex: 99,
};

const SortableItem = sortableElement(({ image, onRemoveImage, index }) => {
  return (
    <Box key={image} className="sortable-thumb" style={thumbStyle(image)}>
      <Button
        alignSelf="end"
        onClick={onRemoveImage}
        icon={
          <Trash
            color="light-1"
            size="small"
            style={{ zIndex: 99, pointerEvents: 'none' }}
          />
        }
        color="dark-1"
        size="small"
        hoverIndicator
        style={thumbIconStyle}
      />
    </Box>
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
