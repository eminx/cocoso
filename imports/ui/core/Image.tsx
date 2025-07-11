import { styled } from 'restyle';

const Image = styled('img', (props: any) => ({
  height: 'auto',
  objectFit: props.objectFit || 'cover',
  // width: '100%',
}));

export default Image;
