import React from 'react';
import Slider from 'react-slick';
import { Box, Image } from 'grommet';
import { Previous, Next } from 'grommet-icons';
import { ScreenClassRender } from 'react-grid-system';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const iconBoxProps = {
  pad: 'xsmall',
  hoverIndicator: 'dark-1',
};

const arrowsContainerStyle = {
  position: 'absolute',
  width: '100%',
  left: -20,
  top: '50%',
  transform: 'translateY(-50%)',
};

const NiceSlider = ({ images }) => (
  <ScreenClassRender
    render={(screenClass) => (
      <Box style={{ position: 'relative' }}>
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
            <Box
              key={image}
              alignSelf="center"
              width={screenClass === 'xs' ? 'medium' : 'large'}
              height={screenClass === 'xs' ? 'small' : 'medium'}
            >
              <Image fill fit="contain" src={image} />
            </Box>
          ))}
        </Slider>

        {images.length > 1 && (
          <Box
            direction="row"
            justify="between"
            round
            style={arrowsContainerStyle}
          >
            <Box {...iconBoxProps} onClick={() => this.slider.slickPrev()}>
              <Previous />
            </Box>
            <Box
              {...iconBoxProps}
              style={{
                ...iconBoxProps.style,
                position: 'absolute',
                right: -40,
              }}
              onClick={() => this.slider.slickNext()}
            >
              <Next />
            </Box>
          </Box>
        )}
      </Box>
    )}
  />
);

export default NiceSlider;
