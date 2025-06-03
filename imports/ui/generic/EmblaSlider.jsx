import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Fade from 'embla-carousel-fade';
import FsLightbox from 'fslightbox-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { Flex, Center, Image } from '/imports/ui/core';

const imageStyle = {
  cursor: 'pointer',
  maxHeight: '480px',
  objectFit: 'contain',
  position: 'relative',
};

function EmptyCircle() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="-2 -2 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
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
    <svg
      width="12"
      height="12"
      viewBox="-2 -2 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
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
        <Flex p="2" css={{ flexWrap: 'wrap' }} gap="2">
          {images.map((image, index) =>
            index === currentSlideIndex ? (
              <FilledCircle key={image} />
            ) : (
              <EmptyCircle key={image} />
            )
          )}
        </Flex>
      )}
    </Center>
  );
}

export default function EmblaSlider({
  images,
  height = 'auto',
  width = '100%',
}) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0 ||
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      );
    };
    setIsTouchDevice(checkTouchDevice());
  }, []);

  const emblaPluginOptions = isTouchDevice ? [] : [Fade()];
  const emblaOptions = {
    loop: true,
    containScroll: isTouchDevice ? 'trimSnaps' : false,
  };

  const [state, setState] = useState({
    currentSlideIndex: 0,
    lightboxToggle: false,
  });
  const [emblaRef, emblaApi] = useEmblaCarousel(
    emblaOptions,
    emblaPluginOptions
  );

  if (!images || images.length === 0) {
    return null;
  }

  useEffect(() => {
    if (!emblaApi) {
      return;
    }
    const interval = setInterval(() => {
      scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) {
      return;
    }
    emblaApi.scrollPrev();
    setState((prevState) => ({
      ...prevState,
      currentSlideIndex: emblaApi.selectedScrollSnap(),
    }));
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) {
      return;
    }
    emblaApi.scrollNext();
    setState((prevState) => ({
      ...prevState,
      currentSlideIndex: emblaApi.selectedScrollSnap(),
    }));
  }, [emblaApi]);

  const imageProps = (image) => ({
    alt: image,
    src: image,
    style: { ...imageStyle, height },
    onClick: () =>
      setState((prevState) => ({
        ...prevState,
        lightboxToggle: true,
      })),
  });

  const lightBoxProps = {
    toggler: state.lightboxToggle,
    sources: images.map((img) => <img key={img} alt={img} src={img} />),
    sourceIndex: state.currentSlideIndex,
  };

  if (images.length === 1) {
    return (
      <>
        <Flex h={height} justify="center">
          <Center>
            <LazyLoadImage {...imageProps(images[0])} />
          </Center>
        </Flex>

        <FsLightbox {...lightBoxProps} />
      </>
    );
  }

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {images.map((image) => (
            <div className="embla__slide" key={image}>
              <LazyLoadImage {...imageProps(image)} />
            </div>
          ))}
        </div>
      </div>

      <Dots
        currentSlideIndex={state.currentSlideIndex}
        images={images}
      />

      <button className="embla__prev" onClick={scrollPrev}>
        Prev
      </button>
      <button className="embla__next" onClick={scrollNext}>
        Next
      </button>

      <FsLightbox {...lightBoxProps} />
    </div>
  );
}
