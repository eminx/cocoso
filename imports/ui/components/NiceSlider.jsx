import React, { useState } from 'react';
import { Box, Center, Flex, HStack } from '@chakra-ui/react';
import FsLightbox from 'fslightbox-react';
import { Fade, Slide } from 'react-slideshow-image';
import { LazyLoadImage } from 'react-lazy-load-image-component';

if (Meteor.isClient) {
  import 'react-slideshow-image/dist/styles.css';
}

const imageStyle = {
  cursor: 'pointer',
  maxHeight: '480px',
  objectFit: 'contain',
  position: 'relative',
};

function NiceSlider({ alt, images, height = 'auto', width = '100%', isFade = true }) {
  const [toggler, setToggler] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <ImageHandler
        height={height}
        images={images}
        isFade={isFade}
        width={width}
        data-oid="65xqrqo"
      >
        {(image, index) => (
          <Center key={image + index} data-oid="-tmy7rx">
            <Flex flexDirection="column" justify="center" data-oid="ekghzph">
              <LazyLoadImage
                alt={alt + ' ' + ' ' + image}
                src={image}
                style={{ ...imageStyle, height }}
                onClick={() => setToggler(!toggler)}
                data-oid="7ar16gl"
              />
            </Flex>
          </Center>
        )}
      </ImageHandler>
      <FsLightbox
        toggler={toggler}
        sources={images.map((img) => (
          <img src={img} data-oid="iua5ut9" />
        ))}
        data-oid="q1tspx0"
      />
    </>
  );
}

function Dots({ images, currentSlideIndex }) {
  return (
    <Center data-oid="gksr9jm">
      {images.length > 1 && (
        <HStack p="2" data-oid="cppwcsm">
          {images.map((image, index) =>
            index === currentSlideIndex ? (
              <FilledCircle key={image} data-oid="2bfr8ml" />
            ) : (
              <EmptyCircle key={image} data-oid="_pfkcgq" />
            )
          )}
        </HStack>
      )}
    </Center>
  );
}

function ImageHandler({ height, width, images, isFade, children }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  if (images?.length === 1) {
    return (
      <Flex h={height} justify={isFade ? 'flex-start' : 'center'} data-oid="q-_hk2k">
        {images.map((image, index) => children(image, index))}
      </Flex>
    );
  } else if (isFade) {
    return (
      <Box className="slide-container" h={height} w={width} data-oid="kz:194j">
        <Fade
          arrows
          canSwipe
          pauseOnHover={false}
          transitionDuration={400}
          onStartChange={(from, to) => setCurrentSlideIndex(to)}
          data-oid="kqk6zi1"
        >
          {images.map((image, index) => children(image, index))}
        </Fade>
        <Dots currentSlideIndex={currentSlideIndex} images={images} data-oid="04jk5fv" />
      </Box>
    );
  } else {
    return (
      <Box className="slide-container" h={height} w={width} data-oid="eb7pgaf">
        <Slide
          arrows
          transitionDuration={400}
          onStartChange={(from, to) => setCurrentSlideIndex(to)}
          data-oid="39t960n"
        >
          {images.map((image, index) => children(image, index))}
        </Slide>
        <Dots currentSlideIndex={currentSlideIndex} images={images} data-oid="1sx09q." />
      </Box>
    );
  }
}

function EmptyCircle() {
  return (
    <svg
      width="8"
      height="8"
      viewBox="-2 -2 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-oid="v:k2wma"
    >
      <circle
        cx="2"
        cy="2"
        r="2.5"
        transform="matrix(1 0 0 -1 1.10059 2.81995)"
        fill="white"
        stroke="black"
        strokeWidth="1"
        data-oid="d_3t5jh"
      />
    </svg>
  );
}

function FilledCircle() {
  return (
    <svg
      width="8"
      height="8"
      viewBox="-2 -2 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-oid="tjod5gb"
    >
      <circle
        cx="2"
        cy="2"
        r="2.5"
        transform="matrix(1 0 0 -1 0.940552 2.81995)"
        fill="#212121"
        stroke="black"
        strokeWidth="1"
        data-oid="gocprtf"
      />
    </svg>
  );
}

export default NiceSlider;
