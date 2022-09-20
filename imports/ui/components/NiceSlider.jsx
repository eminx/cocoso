import React, { useContext, useState } from 'react';
import Slider from 'react-slick';
import { Box, Flex, IconButton, Image } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import FsLightbox from 'fslightbox-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { StateContext } from '../LayoutContainer';

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
  const { isDesktop } = useContext(StateContext);
  const [toggler, setToggler] = useState(false);

  return (
    <Box position="relative" w="100%">
      <Slider
        swipe
        autoplay
        infinite
        dots
        arrows={false}
        fade={isDesktop}
        ref={(component) => (this.slider = component)}
      >
        {images.map((image) => (
          <Box key={image}>
            <Image
              cursor="pointer"
              fit="contain"
              src={image}
              w="100%"
              onClick={() => setToggler(!toggler)}
            />
          </Box>
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
  );
}

export default NiceSlider;
