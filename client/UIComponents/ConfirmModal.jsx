import React from 'react';

import { Layer, Heading, Text, Button, Box } from 'grommet';

const ConfirmModal = ({
  title,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  visible,
  children
}) => {
  if (!visible) {
    return null;
  }
  return (
    <Layer position="center">
      <Box pad="medium" gap="small" width="medium">
        <Heading level={3} margin="none">
          {title}
        </Heading>

        {children}

        <Box
          as="footer"
          gap="small"
          direction="row"
          align="center"
          justify="end"
          pad={{ top: 'medium', bottom: 'small' }}
        >
          <Button label={cancelText || 'Cancel'} onClick={onCancel} />
          <Button
            label={confirmText || 'Confirm'}
            onClick={onConfirm}
            primary
          />
        </Box>
      </Box>
    </Layer>
  );
};

export default ConfirmModal;
