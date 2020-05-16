import React from 'react';
import ReactQuill from 'react-quill';
import { Upload } from 'antd/lib';
import { editorFormats, editorModules } from '../constants/quillConfig';
import { Form, FormField, Text, Box, TextInput, Image, Button } from 'grommet';

const Field = ({ children, ...otherProps }) => (
  <FormField {...otherProps} margin={{ bottom: 'medium' }}>
    {children}
  </FormField>
);

const GroupForm = ({
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
          <Box justify="center" direction="row">
            <Upload
              name="gathering"
              action="/upload.do"
              onChange={setUploadableImage}
              required
            >
              {uploadableImageLocal ? (
                <Box width="large" height="medium">
                  <Image
                    fit="contain"
                    fill
                    src={uploadableImageLocal}
                    style={{ cursor: 'pointer' }}
                  />
                </Box>
              ) : imageUrl ? (
                <Box width="large" height="medium" alignSelf="center">
                  <Image
                    fit="contain"
                    fill
                    src={imageUrl}
                    style={{ cursor: 'pointer' }}
                  />
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

export default GroupForm;
