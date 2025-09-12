import * as React from 'react';
import { styled } from '@stitches/react';

const ImageStyled = styled('img', {});

const Image = (props: any) => (
  <ImageStyled
    css={{
      height: props.h || props.height || 'auto',
      objectFit: props.fit || props.objectFit || 'cover',
      width: props.w || props.width || '100%',
    }}
    {...props}
  />
);

export default Image;
