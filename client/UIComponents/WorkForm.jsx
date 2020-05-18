import React from 'react';
import {
  Box,
  Button,
  TextInput,
  TextArea,
  Text,
  FormField,
  Form
} from 'grommet';
import ReactQuill from 'react-quill';

import FileDropper from '../UIComponents/FileDropper';
import NiceSlider from '../UIComponents/NiceSlider';
import { editorFormats, editorModules } from '../constants/quillConfig';

const WorkForm = ({
  formValues,
  onFormChange,
  onQuillChange,
  onSubmit,
  setUploadableImages,
  uploadableImagesLocal,
  imageUrl,
  buttonLabel,
  isFormValid,
  isButtonDisabled
}) => {
  const images =
    uploadableImagesLocal && uploadableImagesLocal.length > 0
      ? uploadableImagesLocal
      : imageUrl;

  return (
    <div>
      <Form onSubmit={onSubmit} value={formValues} onChange={onFormChange}>
        <FormField
          label={`Images (${uploadableImagesLocal.length})`}
          help={(uploadableImagesLocal || imageUrl) && <Text size="small" />}
        >
          {images && <NiceSlider images={images} />}
          <Box alignSelf="center" margin={{ top: 'medium' }}>
            <FileDropper setUploadableImage={setUploadableImages} />
          </Box>
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

export default WorkForm;
