import React from 'react';
import ReactQuill from 'react-quill';
import { Upload } from 'antd/lib';
import { editorFormats, editorModules } from '../constants/quillConfig';
import { Form, FormField, Box, TextInput, Image, Button } from 'grommet';

const Field = ({ children, ...otherProps }) => (
  <FormField {...otherProps} margin={{ bottom: 'medium' }}>
    {children}
  </FormField>
);

const CreateGroupForm = ({
  uploadableImageLocal,
  setUploadableImage,
  formValues,
  onFormChange,
  onQuillChange,
  onSubmit,
  imageUrl,
  buttonLabel,
  isFormValid,
  isButtonDisabled
}) => {
  return (
    <div>
      <Form onSubmit={onSubmit} value={formValues} onChange={onFormChange}>
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

        <Field label="Image">
          <Box alignSelf="center">
            <Upload
              name="gathering"
              action="/upload.do"
              onChange={setUploadableImage}
              required
            >
              {uploadableImageLocal ? (
                <Box width="medium" height="small">
                  <Image fit="cover" fill src={uploadableImageLocal} />
                </Box>
              ) : imageUrl ? (
                <Box width="medium" height="small">
                  <Image fit="cover" fill src={imageUrl} />
                </Box>
              ) : (
                <Button
                  plain
                  hoverIndicator="light-1"
                  label="Choose an image"
                />
              )}
            </Upload>
          </Box>
        </Field>

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

export default CreateGroupForm;
