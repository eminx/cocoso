import React from 'react';
import ReactQuill from 'react-quill';
import { editorFormats, editorModules } from '../constants/quillConfig';
import { Form, FormField, Text, Box, TextInput, Button } from 'grommet';
import FileDropper from '../UIComponents/FileDropper';

const Field = ({ children, ...otherProps }) => (
  <FormField {...otherProps} margin={{ bottom: 'medium' }}>
    {children}
  </FormField>
);

const ProcessForm = ({
  uploadableImageLocal,
  setUploadableImage,
  formValues,
  onFormChange,
  onQuillChange,
  onSubmit,
  imageUrl,
  buttonLabel,
  isFormValid,
  isButtonDisabled,
}) => {
  return (
    <Box background="white" pad="medium">
      <Form onSubmit={onSubmit} value={formValues} onChange={onFormChange}>
        <Field
          label="Image"
          help={
            (uploadableImageLocal || imageUrl) && (
              <Text size="small">
                If you want to replace it with another one, click on the image
                to reopen the file picker
              </Text>
            )
          }
        >
          <Box alignSelf="center">
            <FileDropper
              uploadableImageLocal={uploadableImageLocal}
              imageUrl={imageUrl}
              setUploadableImage={setUploadableImage}
            />
          </Box>
        </Field>

        <Field label="Title">
          <TextInput
            plain={false}
            name="title"
            placeholder="Understanding Benjamin"
          />
        </Field>

        <Field label="Subtitle">
          <TextInput
            plain={false}
            name="readingMaterial"
            placeholder="through his book Illuminations"
          />
        </Field>

        <Field label="Description">
          <ReactQuill
            value={formValues.description}
            modules={editorModules}
            formats={editorFormats}
            onChange={onQuillChange}
          />
        </Field>

        <Field label="Capacity">
          <TextInput plain={false} name="capacity" />
        </Field>

        <Box direction="row" justify="center" pad="medium">
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
};

export default ProcessForm;
