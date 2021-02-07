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
import { Close } from 'grommet-icons/icons/Close';
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
  flexBasis: 120,
  height: 80,
  margin: 8,
  backgroundImage: backgroundImage && `url('${backgroundImage}')`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  borderRadius: 4,
  border: '1px solid #fff',
});

const thumbIconStyle = {
  float: 'right',
  margin: 2,
  padding: 4,
  borderRadius: 4,
  backgroundColor: 'rgba(255, 255, 255, .8)',
  cursor: 'pointer',
};

const SortableItem = sortableElement(({ image, onRemoveImage, index }) => {
  const onRemoveClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    onRemoveImage();
  };

  return (
    <div key={image} className="sortable-thumb" style={thumbStyle(image)}>
      <Close
        color="dark-1"
        size="small"
        style={thumbIconStyle}
        onClick={onRemoveClick}
      />
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
