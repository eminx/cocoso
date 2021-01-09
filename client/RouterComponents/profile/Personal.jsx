import React from 'react';
import { Box, Form, FormField, TextInput, Button } from 'grommet';
import ReactQuill from 'react-quill';
import { editorFormats, editorModules } from '../../constants/quillConfig';

const Personal = ({
  formValues,
  bio,
  contactInfo,
  onBioChange,
  onContactInfoChange,
  onFormChange,
  onSubmit,
}) => {
  return (
    <Box>
      <Form onSubmit={onSubmit} value={formValues} onChange={onFormChange}>
        <FormField label="first name" name="firstName">
          <TextInput plain={false} name="firstName" placeholder="" />
        </FormField>

        <FormField label="last name" name="lastName">
          <TextInput plain={false} name="lastName" placeholder="" />
        </FormField>

        <FormField label="bio" name="bio">
          <ReactQuill
            value={bio}
            modules={editorModules}
            formats={editorFormats}
            onChange={onBioChange}
          />
        </FormField>

        <FormField label="contact info" name="contactInfo">
          <ReactQuill
            value={contactInfo}
            modules={editorModules}
            formats={editorFormats}
            onChange={onContactInfoChange}
          />
        </FormField>

        <Box direction="row" justify="end" pad="small">
          <Button type="submit" primary label="Confirm" />
        </Box>
      </Form>
    </Box>
  );
};

export default Personal;
