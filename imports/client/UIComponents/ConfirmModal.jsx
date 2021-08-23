import React from 'react';

import { Layer, Heading, Button, Box } from 'grommet';

const ConfirmModal = ({
  visible,
  title,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  confirmButtonProps,
  hideFooter,
  children,
  ...otherProps
}) => {
  if (!visible) {
    return null;
  }
  return (
    <Layer position="center" {...otherProps}>
      <Box pad="medium" gap="small" width="medium">
        <Heading level={3} margin="none">
          {title}
        </Heading>

        {children}

        {!hideFooter && (
          <Box
            as="footer"
            gap="small"
            direction="row"
            align="center"
            justify="end"
            pad={{ top: 'medium', bottom: 'small' }}
          >
            <Button
              label={cancelText || 'Cancel'}
              onClick={onCancel}
              size="small"
            />
            <Button
              {...confirmButtonProps}
              label={confirmText || 'Confirm'}
              onClick={onConfirm}
              primary
              size="small"
            />
          </Box>
        )}
      </Box>
    </Layer>
  );
};

export default ConfirmModal;
