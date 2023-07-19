import React, { useState } from 'react';
import { Box, Center, Flex } from '@chakra-ui/react';
import FsLightbox from 'fslightbox-react';
import { Fade, Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const imageStyle = {
  cursor: 'pointer',
  objectFit: 'contain',
  position: 'relative',
};

function NiceSlider({ alt, floatRight = true, images, width = '100%', isFade = true }) {
  const [toggler, setToggler] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    return (
      <Flex justify={isFade ? 'flex-start' : 'center'}>
        <Box>
          <LazyLoadImage
            alt={alt}
            src={images[0]}
            style={imageStyle}
            onClick={() => setToggler(!toggler)}
          />
        </Box>

        <FsLightbox
          toggler={toggler}
          sources={images.map((img) => (
            <img src={img} />
          ))}
        />
      </Flex>
    );
  }

  if (isFade) {
    return (
      <Box className="slide-container" w={width}>
        <Fade arrows={false} transitionDuration={400}>
          {images.map((image) => (
            <Flex key={image} justify={floatRight ? 'flex-end' : 'center'}>
              <LazyLoadImage
                alt={alt}
                src={image}
                style={imageStyle}
                onClick={() => setToggler(!toggler)}
              />
            </Flex>
          ))}
        </Fade>

        <FsLightbox
          toggler={toggler}
          sources={images.map((img) => (
            <img src={img} />
          ))}
        />
      </Box>
    );
  }

  return (
    <Box className="slide-container" w={width}>
      <Slide arrows={false} transitionDuration={400}>
        {images.map((image) => (
          <Center key={image}>
            <Flex flexDirection="column" justify="center">
              <LazyLoadImage
                alt={alt}
                src={image}
                style={imageStyle}
                onClick={() => setToggler(!toggler)}
              />
            </Flex>
          </Center>
        ))}
      </Slide>

      <FsLightbox
        toggler={toggler}
        sources={images.map((img) => (
          <img src={img} />
        ))}
      />
    </Box>
  );
}

export default NiceSlider;
