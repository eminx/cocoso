import React from 'react';
import {
  Box,
  Button,
  CheckBox,
  Form,
  FormField,
  Heading,
  Text,
  TextArea,
  TextInput,
} from 'grommet';

import Tag from './Tag';

function ResourceForm({
  content,
  setContent,
  suggestions,
  comboInput,
  setComboInput,
  onSuggestionSelect,
  removeResourceForCombo,
  onSubmit,
}) {
  const isEdit = content && content.edit;
  const isCombo = content && content.isCombo;

  return (
    <Box>
      <Heading level={3} margin={{ top: 'medium', left: 'medium' }}>
        {`${isEdit ? 'Edit' : 'New'} Resource`}
      </Heading>

      <Box width="medium" pad="medium">
        <Form
          value={content}
          onChange={(nextValue) => setContent(nextValue)}
          onSubmit={onSubmit}
        >
          <FormField margin={{ bottom: 'medium' }}>
            <CheckBox
              checked={content && isCombo}
              label="Combo Resource"
              name="isCombo"
              disabled={isEdit}
            />
          </FormField>
          {content && isCombo && (
            <Box background="light-1" pad="small">
              <Text size="small">
                Please select multiple resources to create a combo resource
              </Text>
              <Box
                direction="row"
                gap="small"
                justify="center"
                pad={{ top: 'small' }}
                wrap
              >
                {content.resourcesForCombo
                  ? content.resourcesForCombo.map((res) => (
                      <Tag
                        key={res._id}
                        label={res.label.toUpperCase()}
                        margin={{ bottom: 'small' }}
                        removable
                        onRemove={() => removeResourceForCombo(res)}
                      />
                    ))
                  : []}
              </Box>
              <Box
                alignSelf="center"
                direction="row"
                gap="small"
                width="medium"
              >
                <TextInput
                  placeholder="Select Resources"
                  size="small"
                  style={{ backgroundColor: 'white' }}
                  suggestions={suggestions}
                  value={comboInput}
                  onChange={(event) => {
                    setComboInput(event.target.value);
                  }}
                  onSuggestionSelect={onSuggestionSelect}
                />
              </Box>
            </Box>
          )}

          <FormField label="Name" margin={{ top: 'medium', bottom: 'small' }}>
            <TextInput
              name="label"
              placeholder="Sound Studio"
              plain={false}
              size="small"
            />
          </FormField>

          <FormField label="Description">
            <TextArea
              name="description"
              placeholder="Using studio requires care..."
              plain={false}
              size="small"
            />
          </FormField>

          <Box direction="row" justify="end" pad="small">
            <Button
              disabled={isCombo ? content.resourcesForCombo.length < 2 : false}
              label="Confirm"
              primary
              type="submit"
            />
          </Box>
        </Form>
      </Box>
    </Box>
  );
}

export default ResourceForm;
