import React, { useState } from 'react';
import { Link, Navigate } from 'react-router';
import ChevronLeftIcon from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRightIcon from 'lucide-react/dist/esm/icons/chevron-right';
import { useTranslation } from 'react-i18next';
import parseHtml from 'html-react-parser';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { useAtomValue } from 'jotai';

import { Box, Button, Center } from '/imports/ui/core';
import { currentUserAtom, platformAtom } from '/imports/ui/LayoutContainer';

export default function RegistrationIntro() {
  const currentUser = useAtomValue(currentUserAtom);
  const platform = useAtomValue(platformAtom);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [tc] = useTranslation('common');

  if (!currentUser) {
    return <Navigate to="/register" />;
  }

  if (!platform || !platform.registrationIntro) {
    return null;
  }

  const { registrationIntro } = platform;

  const isLastSlide = currentSlide + 1 === registrationIntro?.length;

  const arrowButtonProps = {
    mt: '512px',
    size: 'sm',
    variant: 'link',
    css: {
      color: 'var(--cocoso-colors-gray-200)',
    },
  };

  return (
    <Box mt="4">
      {/* <Center pb="4">
        <Image className="logo" fit="contain" src={platform.logo} />
      </Center> */}
      <Box bg="theme.900" mx="4" pt="8" pb="20">
        {/* <Center pb="4">
          <Heading color="gray.50">{platform.name}</Heading>
        </Center> */}
        <Center>
          <Box
            bg="white"
            className="slide-container"
            p="4"
            w="100%"
            css={{ maxWidth: '420px' }}
          >
            <Slide
              autoplay={false}
              easing="cubic-out"
              infinite={false}
              nextArrow={
                <Button
                  {...arrowButtonProps}
                  disabled={isLastSlide}
                  rightIcon={<ChevronRightIcon />}
                >
                  {tc('actions.next')}
                </Button>
              }
              prevArrow={
                <Button
                  {...arrowButtonProps}
                  disabled={currentSlide === 0}
                  leftIcon={<ChevronLeftIcon />}
                >
                  {tc('actions.previous')}
                </Button>
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

      <Center p="4" mt="-82px">
        <Link to={isLastSlide ? '/communities' : '/'}>
          <Button
            as="div"
            colorScheme="green"
            size="sm"
            variant={isLastSlide ? 'solid' : 'ghost'}
          >
            {isLastSlide ? tc('actions.start') : tc('actions.skip')}
          </Button>
        </Link>
      </Center>
    </Box>
  );
}
