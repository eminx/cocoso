import { styled } from 'restyle';

// Alert
interface AlertProps {
  status?: 'info' | 'warning' | 'success' | 'error';
}

const alertColors = {
  info: '#3182CE',
  warning: '#DD6B20',
  success: '#38A169',
  error: '#E53E3E',
};

export const Alert = styled('div', (props: AlertProps) => ({
  padding: '1rem',
  borderRadius: '0.375rem',
  backgroundColor: props.status
    ? `${alertColors[props.status]}20`
    : '#3182CE20',
  border: '1px solid',
  borderColor: props.status ? alertColors[props.status] : '#3182CE',
  color: props.status ? alertColors[props.status] : '#3182CE',
}));

export const AlertTitle = styled('div', {
  fontWeight: 'bold',
  marginBottom: '0.5rem',
});

export const AlertDescription = styled('div', {
  fontSize: '0.875rem',
});
