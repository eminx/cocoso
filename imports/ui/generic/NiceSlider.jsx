import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { Box, Center, Flex, HStack, Img } from '@chakra-ui/react';
import FsLightbox from 'fslightbox-react';
import { Fade, Slide } from 'react-slideshow-image';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Client, useHydrated } from 'react-hydration-provider';

if (Meteor.isClient) {
  import 'react-slideshow-image/dist/styles.css';
}

const imageStyle = {
  cursor: 'pointer',
  maxHeight: '480px',
  objectFit: 'contain',
  position: 'relative',
};

function EmptyCircle() {
  return (
    <svg width="8" height="8" viewBox="-2 -2 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="2"
        cy="2"
        r="2.5"
        transform="matrix(1 0 0 -1 1.10059 2.81995)"
        fill="white"
        stroke="black"
        strokeWidth="1"
      />
    </svg>
  );
}

function FilledCircle() {
  return (
    <svg width="8" height="8" viewBox="-2 -2 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="2"
        cy="2"
        r="2.5"
        transform="matrix(1 0 0 -1 0.940552 2.81995)"
        fill="#212121"
        stroke="black"
        strokeWidth="1"
      />
    </svg>
  );
}

function Dots({ images, currentSlideIndex }) {
  return (
    <Center>
      {images.length > 1 && (
        <HStack p="2">
          {images.map((image, index) =>
            index === currentSlideIndex ? <FilledCircle key={image} /> : <EmptyCircle key={image} />
          )}
        </HStack>
      )}
    </Center>
  );
}

function ImageHandler({ height, width, images, children }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const hydrated = useHydrated();
  const isMobile = hydrated && window.innerWidth < 768;

  if (!images || images.length < 2) {
    return null;
  }

  if (!isMobile) {
    return (
      <Box className="slide-container" h={height} w={width}>
        <Fade
          arrows
          canSwipe
          pauseOnHover={false}
          transitionDuration={400}
          onStartChange={(from, to) => setCurrentSlideIndex(to)}
        >
          {images.map((image, index) => children(image, index))}
        </Fade>
        <Dots currentSlideIndex={currentSlideIndex} images={images} />
      </Box>
    );
  }
  return (
    <Box className="slide-container" h={height} w={width}>
      <Slide arrows transitionDuration={400} onStartChange={(from, to) => setCurrentSlideIndex(to)}>
        {images.map((image, index) => children(image, index))}
      </Slide>
      <Dots currentSlideIndex={currentSlideIndex} images={images} />
    </Box>
  );
}

export default function NiceSlider({ alt, images, height = 'auto', width = '100%' }) {
  const [toggler, setToggler] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    return (
      <>
        <Flex h={height} justify="center">
          <Center>
            <Img src={images[0]} style={imageStyle} onClick={() => setToggler(!toggler)} />
          </Center>
        </Flex>

        <Client>
          <FsLightbox
            toggler={toggler}
            sources={images.map((img) => (
              <img alt={img} src={img} />
            ))}
          />
        </Client>
      </>
    );
  }

  return (
    <>
      <ImageHandler height={height} images={images} width={width}>
        {(image, index) => (
          <Center key={image + index}>
            <Flex flexDirection="column" justify="center">
              <LazyLoadImage
                alt={`${alt} ${image}`}
                src={image}
                style={{ ...imageStyle, height }}
                onClick={() => setToggler(!toggler)}
              />
            </Flex>
          </Center>
        )}
      </ImageHandler>
      <Client>
        <FsLightbox
          toggler={toggler}
          sources={images.map((img) => (
            <img alt={img} src={img} />
          ))}
        />
      </Client>
    </>
  );
}
