import React from 'react';
import {
  TextInput,
  TextArea,
  Text,
  FormField,
  Form,
  Box,
  Button
} from 'grommet';
import ReactQuill from 'react-quill';
import FileDropper from '../UIComponents/FileDropper';
import { editorFormats, editorModules } from '../constants/quillConfig';

const WorkForm = ({
  formValues,
  onFormChange,
  onQuillChange,
  onSubmit,
  setUploadableImages,
  uploadableImagesLocal,
  imageUrl
}) => {
  return (
    <div>
      <Form onSubmit={onSubmit} value={formValues} onChange={onFormChange}>
        <FormField
          label="Image"
          help={(uploadableImagesLocal || imageUrl) && <Text size="small" />}
        >
          <Box alignSelf="center">
            <FileDropper
              uploadableImageLocal={uploadableImagesLocal}
              imageUrl={imageUrl}
              setUploadableImages={setUploadableImages}
            />
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
            name="title"
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
            name="title"
            placeholder="A bottle costs..."
          />
        </FormField>

        <Box direction="row" justify="end" pad="small">
          <Button type="submit" primary label="Confirm" />
        </Box>
      </Form>
    </div>
  );
};

export default WorkForm;
