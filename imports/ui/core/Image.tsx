import { styled } from 'restyle';

const Image = styled('img', (props: any) => ({
  height: props.h || props.height || 'auto',
  objectFit: props.fit || props.objectFit || 'cover',
  width: props.w || props.width || '100%',
}));

export default Image;
