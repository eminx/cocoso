import React, { useContext, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Box, Button, Center, Heading, Image } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import renderHTML from 'react-render-html';

import { StateContext } from '../../LayoutContainer';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

function RegistrationIntro() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { currentUser, platform } = useContext(StateContext);
  const [tc] = useTranslation('common');

  if (!currentUser) {
    return <Redirect to="/register" />;
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
  };

  return (
    <Box mt="4">
      {/* <Center pb="4">
        <Image className="logo" fit="contain" src={platform.logo} />
      </Center> */}
      <Box bg="gray.800" mx="4" pt="8" pb="20">
        {/* <Center pb="4">
          <Heading color="gray.50">{platform.name}</Heading>
        </Center> */}
        <Center>
          <Box bg="white" className="slide-container" maxW="420px" p="4" w="100%">
            <Slide
              autoplay={false}
              easing="cubic-out"
              infinite={false}
              nextArrow={
                <Button
                  {...arrowButtonProps}
                  color="green.200"
                  isDisabled={isLastSlide}
                  rightIcon={<ChevronRightIcon />}
                >
                  {tc('actions.next')}
                </Button>
              }
              prevArrow={
                <Button
                  {...arrowButtonProps}
                  color="gray.200"
                  isDisabled={currentSlide === 0}
                  leftIcon={<ChevronLeftIcon />}
                >
                  {tc('actions.previous')}
                </Button>
              }
              transitionDuration={400}
              onChange={(from, to) => setCurrentSlide(to)}
            >
              {registrationIntro?.map((slide) => (
                <Box key={slide} className="text-content" h="420px" overflowY="scroll" p="4">
                  {renderHTML(slide)}
                </Box>
              ))}
            </Slide>
          </Box>
        </Center>
      </Box>

      <Center p="4" mt="-82px">
        <Link to={isLastSlide ? `/@${currentUser.username}/edit` : '/'}>
          <Button as="span" colorScheme="green" size="sm" variant={isLastSlide ? 'solid' : 'ghost'}>
            {isLastSlide ? tc('actions.start') : tc('actions.skip')}
          </Button>
        </Link>
      </Center>
    </Box>
  );
}

export default RegistrationIntro;
