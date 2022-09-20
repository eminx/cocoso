import React, { useContext, useState } from 'react';
import { Box, Flex, Image } from '@chakra-ui/react';
import FsLightbox from 'fslightbox-react';
import { Fade, Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

function NiceSlider({ images, width = '100vw', isFade = true }) {
  const [toggler, setToggler] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    return (
      <Flex justify={width === '40vw' ? 'flex-end' : 'center'}>
        <Box>
          <Image
            cursor="pointer"
            fit="contain"
            src={images[0]}
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
        <Fade transitionDuration={400}>
          {images.map((image) => (
            <Box key={image}>
              <Image
                cursor="pointer"
                fit="contain"
                float="right"
                src={image}
                onClick={() => setToggler(!toggler)}
              />
            </Box>
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
      <Slide transitionDuration={400}>
        {images.map((image) => (
          <Box key={image}>
            <Image
              cursor="pointer"
              fit="contain"
              src={image}
              margin="0 auto"
              onClick={() => setToggler(!toggler)}
            />
          </Box>
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
