import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { Link } from 'react-router';
import ChevronLeftIcon from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRightIcon from 'lucide-react/dist/esm/icons/chevron-right';
import { useTranslation } from 'react-i18next';
import parseHtml from 'html-react-parser';
import { Slide } from 'react-slideshow-image';
import { useAtomValue } from 'jotai';

import {
  Box,
  Button,
  Center,
  Heading,
  Image,
  IconButton,
} from '/imports/ui/core';
import { platformAtom } from '/imports/state';

if (Meteor.isClient) {
  import('react-slideshow-image/dist/styles.css');
}

export default function RegistrationIntro({ isModal = false }) {
  const platform = useAtomValue(platformAtom);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [tc] = useTranslation('common');

  if (!platform || !platform.registrationIntro) {
    return null;
  }

  const registrationIntro = platform?.registrationIntro;
  const isLastSlide = currentSlide + 1 === registrationIntro?.length;

  return (
    <Box>
      <Center mb="2">
        <Image className="logo" fit="contain" src={platform.logo} />
      </Center>
      <Box pb={isModal ? '0' : '20'}>
        <Center mb="4">
          <Heading>{platform.name}</Heading>
        </Center>
        <Center>
          <Box
            bg="white"
            className="slide-container"
            p="4"
            w="100%"
            css={{
              borderRadius: 'var(--cocoso-border-radius)',
              maxWidth: '420px',
            }}
          >
            <Slide
              autoplay={false}
              easing="cubic-out"
              infinite={false}
              nextArrow={
                <IconButton
                  aria-label="Next"
                  disabled={isLastSlide}
                  icon={<ChevronRightIcon />}
                  css={{
                    transform: 'translateX(64px)',
                    '@media(max-width: 720px)': {
                      transform: 'translateX(20px) scale(0.7)',
                    },
                  }}
                />
              }
              prevArrow={
                <IconButton
                  aria-label="Previous"
                  disabled={currentSlide === 0}
                  icon={<ChevronLeftIcon />}
                  css={{
                    transform: 'translateX(-64px)',
                    '@media(max-width: 720px)': {
                      transform: 'translateX(-20px) scale(0.7)',
                    },
                  }}
                />
              }
              transitionDuration={400}
              onChange={(from, to) => setCurrentSlide(to)}
            >
              {registrationIntro?.map((slide) => (
                <Box
                  key={slide}
                  className="text-content"
                  h="420px"
                  p="4"
                  css={{
                    overflowY: 'scroll',
                  }}
                >
                  {parseHtml(slide)}
                </Box>
              ))}
            </Slide>
          </Box>
        </Center>
      </Box>

      {!isModal && (
        <Center mb="8" p="4" css={{ marginTop: '-78px' }}>
          <Link to="/">
            <Button size="sm" variant={isLastSlide ? 'solid' : 'ghost'}>
              {isLastSlide ? tc('actions.start') : tc('actions.skip')}
            </Button>
          </Link>
        </Center>
      )}
    </Box>
  );
}
