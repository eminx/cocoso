import React from 'react';
import { TextInput, FormField, Form, Box, Button } from 'grommet';
import ReactQuill from 'react-quill';
import { editorFormats, editorModules } from '../constants/quillConfig';

const PageForm = ({ formValues, onFormChange, onQuillChange, onSubmit }) => {
  return (
    <div>
      <Form onSubmit={onSubmit} value={formValues} onChange={onFormChange}>
        <FormField label="Title" margin={{ bottom: 'medium', top: 'medium' }}>
          <TextInput plain={false} name="title" placeholder="Contributing" />
        </FormField>

        <FormField label="Description" margin={{ bottom: 'medium' }}>
          <ReactQuill
            value={formValues.longDescription}
            modules={editorModules}
            formats={editorFormats}
            onChange={onQuillChange}
          />
        </FormField>

        <Box direction="row" justify="end" pad="small">
          <Button type="submit" primary label="Confirm" />
        </Box>
      </Form>
    </div>
  );
};

export default PageForm;
