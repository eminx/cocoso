import React from 'react';
import { TextInput, TextArea, FormField, Form, Box, Button } from 'grommet';
import { hostFields } from '../constants/general';

function Field(props) {
  return (
    <FormField label={props.label}>
      {props.textArea ? (
        <TextArea {...props} />
      ) : (
        <TextInput {...props} plain={false} />
      )}
    </FormField>
  );
}

function NewHostForm({ formValues, onFormChange, onSubmit }) {
  return (
    <div>
      <Form onSubmit={onSubmit} value={formValues} onChange={onFormChange}>
        {hostFields.map((field) => (
          <Field {...field} margin={{ bottom: 'medium', top: 'medium' }} />
        ))}
        <Box direction="row" justify="end" pad="small">
          <Button type="submit" primary label="Confirm" />
        </Box>
      </Form>
    </div>
  );
}

export default NewHostForm;
