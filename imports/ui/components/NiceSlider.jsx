import React, { useState } from 'react';
import { Box, Center, Flex, Skeleton } from '@chakra-ui/react';
import FsLightbox from 'fslightbox-react';
import { Fade, Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const imageStyle = {
  cursor: 'pointer',
  objectFit: 'contain',
  position: 'relative',
};

function NiceSlider({ alt, images, height = '400px', width = '100%', isFade = true }) {
  const [toggler, setToggler] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <ImageHandler height={height} images={images} isFade={isFade} width={width}>
        {(image, index) => (
          <Center key={image}>
            <Flex bg="gray.50" flexDirection="column" justify="center">
              <LazyLoadImage
                alt={alt + image}
                src={image}
                style={{ ...imageStyle, height }}
                onClick={() => setToggler(!toggler)}
              />
            </Flex>
          </Center>
        )}
      </ImageHandler>
      <FsLightbox
        toggler={toggler}
        sources={images.map((img) => (
          <img src={img} />
        ))}
      />
    </>
  );
}

function ImageHandler({ height, width, images, isFade, children }) {
  if (images?.length === 1) {
    return (
      <Flex h={height} justify={isFade ? 'flex-start' : 'center'}>
        {images.map((image, index) => children(image, index))}
      </Flex>
    );
  } else if (isFade) {
    return (
      <Box className="slide-container" h={height} w={width}>
        <Fade arrows={false} transitionDuration={400}>
          {images.map((image, index) => children(image, index))}
        </Fade>
      </Box>
    );
  } else {
    return (
      <Box className="slide-container" h={height} w={width}>
        <Slide arrows={false} transitionDuration={400}>
          {images.map((image, index) => children(image, index))}
        </Slide>
      </Box>
    );
  }
}

export default NiceSlider;
