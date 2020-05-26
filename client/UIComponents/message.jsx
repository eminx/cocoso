import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Box, Button, Layer, Text } from 'grommet';
import {
  FormClose,
  StatusGood,
  StatusCritical,
  StatusInfo,
} from 'grommet-icons';

const toastTarget = document.getElementById('toast-target');
const removeNode = () => unmountComponentAtNode(toastTarget);
const timeOutTime = 6000;

const renderToast = (text, duration, type) => {
  render(<Toast type={type} text={text} onClose={removeNode} />, toastTarget);
  setTimeout(removeNode, duration);
};

const Alert = ({ message, onClose, type }) => {
  const success = type === 'success';
  const error = type === 'error';
  const info = type === 'info';
  const warning = type === 'warning';

  return (
    <Box
      align="center"
      direction="row"
      gap="small"
      justify="between"
      round="xsmall"
      elevation="medium"
      pad="small"
      background="light-2"
    >
      <Box align="center" direction="row" gap="xsmall">
        {success && <StatusGood color="status-ok" />}
        {error && <StatusCritical color="status-critical" />}
        {info && <StatusInfo />}
        {warning && <Alert color="status-warning" />}

        <Text weight="bold" style={{ fontFamily: 'sans' }}>
          {message}
        </Text>
      </Box>
      {onClose && (
        <Button
          focusIndicator={false}
          icon={<FormClose />}
          plain
          onClick={onClose}
        />
      )}
    </Box>
  );
};

const message = {
  success: (text, duration = timeOutTime) =>
    renderToast(text, duration, 'success'),

  error: (text, duration = timeOutTime) => renderToast(text, duration, 'error'),

  info: (text, duration = timeOutTime) => renderToast(text, duration, 'info'),
};

const Toast = ({ text, onClose, type = 'info' }) => {
  const noteProps = {
    message: text,
    type,
    onClose,
  };

  return (
    <Layer
      position="top"
      modal={false}
      margin={{ vertical: 'medium', horizontal: 'small' }}
      onEsc={onClose}
      responsive={false}
      plain
    >
      <Alert {...noteProps} />
    </Layer>
  );
};

const SimpleTag = ({ checked, color, onClick, children, ...otherProps }) => (
  <Button
    size="xsmall"
    plain
    onClick={onClick}
    label={children}
    style={{ borderRadius: 0, padding: '0 4px', fontSize: 12, lineHeight: 1.5 }}
    className={checked ? 'checked ' + color : color}
    {...otherProps}
  />
);

export { message, Alert, SimpleTag };
