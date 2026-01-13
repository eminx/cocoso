import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Fade from 'embla-carousel-fade';
import FsLightbox from 'fslightbox-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { Flex, Center } from '/imports/ui/core';

const imageStyle: React.CSSProperties = {
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
        stroke="#212121"
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
        stroke="#212121"
        strokeWidth="1"
      />
    </svg>
  );
}

interface DotsProps {
  images: string[];
  currentSlideIndex: number;
}

function Dots({ images, currentSlideIndex }: DotsProps) {
  return (
    <Flex
      css={{
        align: 'center',
        flexDirection: 'column',
        margin: '4px 16px',
        paddingTop: '4px',
      }}
    >
      <Center>
        {images.length > 1 && (
          <Flex>
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
    </Flex>
  );
}

const checkTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0 ||
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
};

export interface EmblaSliderProps {
  images?: string[];
  height?: string | number;
  width?: string | number;
}

export default function EmblaSlider({
  images,
  height = 'auto',
  width = '100%',
}: EmblaSliderProps) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsTouchDevice(checkTouchDevice());
  }, []);

  const emblaPluginOptions = isTouchDevice ? [] : [Fade()];
  const emblaOptions = {
    loop: true,
    containScroll: isTouchDevice ? ('trimSnaps' as const) : (false as const),
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

  useEffect(() => {
    if (!emblaApi) {
      return;
    }
    // Clear any existing interval before setting a new one
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      scrollNext();
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null; // Reset ref
      }
    };
  }, [emblaApi, scrollNext]);

  const imageProps = (image: string) => ({
    alt: image,
    src: image,
    style: { ...imageStyle, height },
    onClick: () => {
      setState((prevState) => ({
        ...prevState,
        lightboxToggle: !state.lightboxToggle,
      }));
    },
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

      <Flex
        align="center"
        justify="center"
        css={{ alignItems: 'center', padding: '8px' }}
      >
        <button className="embla__prev embla__button" onClick={scrollPrev}>
          <svg className="embla__button__svg" viewBox="0 0 532 532">
            <path
              fill="currentColor"
              d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
            />
          </svg>
        </button>

        <Dots currentSlideIndex={state.currentSlideIndex} images={images} />

        <button className="embla__next embla__button" onClick={scrollNext}>
          <svg className="embla__button__svg" viewBox="0 0 532 532">
            <path
              fill="currentColor"
              d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z"
            />
          </svg>
        </button>
      </Flex>

      <FsLightbox {...lightBoxProps} />
    </div>
  );
}
