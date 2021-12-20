import React, { useState } from 'react';
import Slider from 'react-slick';
import { Box, Image } from 'grommet';
import { Previous } from 'grommet-icons/icons/Previous';
import { Next } from 'grommet-icons/icons/Next';
import { ScreenClassRender } from 'react-grid-system';
import FsLightbox from 'fslightbox-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const iconBoxProps = {
  pad: 'xsmall',
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
        <Box style={{ position: 'relative' }} background="dark-1">
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
                height={screenClass === 'xs' ? 'small' : 'medium'}
                width={screenClass === 'xs' ? 'medium' : 'large'}
                onClick={() => setToggler(!toggler)}
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
                  right: 0,
                }}
                onClick={() => this.slider.slickNext()}
              >
                <Next />
              </Box>
            </Box>
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
