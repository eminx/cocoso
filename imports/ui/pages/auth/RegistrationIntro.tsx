import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import ChevronLeftIcon from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRightIcon from 'lucide-react/dist/esm/icons/chevron-right';
import { useTranslation } from 'react-i18next';
import parseHtml from 'html-react-parser';
import { Slide } from 'react-slideshow-image';
import { useAtomValue } from 'jotai';
import 'react-slideshow-image/dist/styles.css';

import { Box, Button, Center, Link as CLink } from '/imports/ui/core';
import { currentUserAtom, platformAtom } from '/imports/state';

export default function RegistrationIntro() {
  const currentUser = useAtomValue(currentUserAtom);
  const platform = useAtomValue(platformAtom);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [tc] = useTranslation('common');
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser]);

  if (!platform || !platform.registrationIntro) {
    return null;
  }

  const { registrationIntro } = platform;

  const isLastSlide = currentSlide + 1 === registrationIntro?.length;

  const arrowButtonProps = {
    size: 'sm',
    css: {
      color: 'var(--cocoso-colors-gray-200)',
      marginTop: '512px',
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

      <Center mb="8" p="4" css={{ marginTop: '-78px' }}>
        <Link to={isLastSlide ? '/communities' : '/'}>
          <CLink
            size="sm"
            css={{ color: 'var(--cocoso-colors-blue-300)', fontSize: '0.9rem' }}
          >
            {isLastSlide ? tc('actions.start') : tc('actions.skip')}
          </CLink>
        </Link>
      </Center>
    </Box>
  );
}
