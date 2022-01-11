import React, { useState } from 'react';
import Slider from 'react-slick';
import { Box, Center, Flex, IconButton, Image } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { ScreenClassRender } from 'react-grid-system';
import FsLightbox from 'fslightbox-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const iconBoxProps = {
  p: '2',
};

const arrowsContainerStyle = {
  position: 'absolute',
  width: '100%',
  left: 0,
  top: '50%',
  transform: 'translateY(-50%)',
};

function NiceSlider({ images }) {
  const [toggler, setToggler] = useState(false);

  return (
    <ScreenClassRender
      render={(screenClass) => (
        <Box bg="gray.900" position="relative">
          <Slider
            swipe
            autoplay
            infinite
            dots
            arrows={false}
            fade={['lg', 'xl'].includes(screenClass)}
            ref={(component) => (this.slider = component)}
          >
            {images.map((image) => (
              <Center key={image} width="100%">
                <Image
                  w="auto"
                  h={screenClass === 'xs' ? '200px' : 'sm'}
                  fit="contain"
                  src={image}
                  style={{ cursor: 'pointer', margin: '0 auto' }}
                  onClick={() => setToggler(!toggler)}
                />
              </Center>
            ))}
          </Slider>

          {images.length > 1 && (
            <Flex justify="space-between" style={arrowsContainerStyle}>
              <Box {...iconBoxProps}>
                <IconButton
                  aria-label="Slide back"
                  bg="rgba(255, 255, 255, 0.5)"
                  icon={<ArrowBackIcon />}
                  onClick={() => this.slider.slickPrev()}
                />
              </Box>

              <Box
                {...iconBoxProps}
                style={{
                  ...iconBoxProps.style,
                  position: 'absolute',
                  right: 0,
                }}
              >
                <IconButton
                  aria-label="Slide forward"
                  bg="rgba(255, 255, 255, 0.5)"
                  icon={<ArrowForwardIcon />}
                  onClick={() => this.slider.slickNext()}
                />
              </Box>
            </Flex>
          )}

          <FsLightbox
            toggler={toggler}
            sources={images.map((img) => (
              <img src={img} />
            ))}
          />
        </Box>
      )}
    />
  );
}

export default NiceSlider;
