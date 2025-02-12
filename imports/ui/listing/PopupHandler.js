import React, { useContext, useState } from 'react';
import { Badge, Box, Center, Flex, Heading, ModalBody } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import parseHtml from 'html-react-parser';
import { useTranslation } from 'react-i18next';

import Modal from '../generic/Modal';
import { StateContext } from '../LayoutContainer';
import { DateJust } from '../entry/FancyDate';
import NiceSlider from '../generic/NiceSlider';

const yesterday = dayjs().add(-1, 'days');
const today = dayjs();

const getFutureOccurrences = (dates) =>
  dates
    .filter((date) => date && dayjs(date.endDate)?.isAfter(yesterday))
    .sort((a, b) => dayjs(a?.startDate) - dayjs(b?.startDate));

const getPastOccurrences = (dates) =>
  dates
    .filter((date) => dayjs(date.startDate)?.isBefore(today))
    .sort((a, b) => dayjs(b.startDate) - dayjs(a.startDate));

function DatesForAction({ activity, showPast = false }) {
  if (!activity || !activity.datesAndTimes || !activity.datesAndTimes.length) {
    return null;
  }

  const dates = showPast
    ? getPastOccurrences(activity.datesAndTimes)
    : getFutureOccurrences(activity.datesAndTimes);

  return (
    <Flex pt="4">
      {dates.map(
        (occurence) =>
          occurence && (
            <Flex key={occurence.startDate + occurence.endTime} pr="6">
              <Box>
                <DateJust>{occurence.startDate}</DateJust>
              </Box>
              {occurence.startDate !== occurence.endDate && (
                <Flex>
                  {'-'}
                  <DateJust>{occurence.endDate}</DateJust>
                </Flex>
              )}
            </Flex>
          )
      )}
    </Flex>
  );
}

function PopupHeader({ subTitle, tags, title }) {
  const fontFamily = "'Raleway', sans-serif";

  return (
    <Box mb="8">
      <Heading
        as="h1"
        fontFamily={fontFamily}
        fontSize="1.8em"
        lineHeight={1}
        mb="2"
        textAlign="center"
        textShadow="1px 1px 1px #fff"
      >
        {title}
      </Heading>
      {subTitle && (
        <Heading as="h2" fontSize="1.3em" fontWeight="light" lineHeight={1} textAlign="center">
          {subTitle}
        </Heading>
      )}
      {tags && tags.length > 0 && (
        <Flex flexGrow="0" justify="center" pt="2">
          {tags.map(
            (tag) =>
              tag && (
                <Badge key={tag} bg="gray.50" color="gray.800" fontSize="14px">
                  {tag}
                </Badge>
              )
          )}
        </Flex>
      )}
    </Box>
  );
}

function PopupContent({ action = null, content, images, subTitle, title, tags = null }) {
  return (
    <>
      <PopupHeader subTitle={subTitle} tags={tags} title={title} />
      <Center>
        <NiceSlider alt={title} images={images} isFade={false} />
      </Center>
      <Center mb="4" mx="4">
        {action}
      </Center>

      <Box className="text-content">{content}</Box>
    </>
  );
}

const getLinkPath = (item, kind, isCurrentHost = false) => {
  if (isCurrentHost) {
    if (kind === 'works') {
      return {
        isHref: false,
        path: `/@${item.authorUsername}/${kind}/${item._id}/info`,
      };
    }
    return {
      isHref: false,
      path: `/${kind}/${item._id}/info`,
    };
  }
  if (kind === 'works') {
    return {
      isHref: true,
      path: `https://${item.host}/@${item.authorUsername}/${kind}/${item._id}/info`,
    };
  }
  return {
    isHref: true,
    path: `https://${item.host}/${kind}/${item._id}/info`,
  };
};

export default function PopupHandler({ item, kind, onClose }) {
  const [copied, setCopied] = useState(false);
  const { allHosts, currentHost } = useContext(StateContext);
  const navigate = useNavigate();
  const [tc] = useTranslation('common');

  const isPortalHost = currentHost?.isPortalHost;

  const getButtonLabel = () => {
    if (!isPortalHost || item?.host === currentHost?.host) {
      return tc('actions.entryPage');
    }
    return tc('actions.toThePage', {
      hostName: allHosts?.find((h) => h?.host === item?.host)?.name,
    });
  };

  const handleCopyLink = async () => {
    const link = getLinkPath(item, kind);
    try {
      await navigator.clipboard.writeText(link.path);
      setCopied(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleActionButtonClick = () => {
    const link = getLinkPath(item, kind, item.host === currentHost.host);
    if (link.isHref) {
      window.open(link.path, '_self');
      return;
    }
    navigate(link.path);
  };

  return (
    <Modal
      actionButtonLabel={getButtonLabel()}
      bg="gray.100"
      isOpen={item}
      secondaryButtonLabel={copied ? tc('actions.copied') : tc('actions.share')}
      size="xl"
      onActionButtonClick={() => handleActionButtonClick()}
      onClose={onClose}
      onSecondaryButtonClick={handleCopyLink}
    >
      <ModalBody p="0">
        <PopupContent
          action={<DatesForAction item={item} />}
          content={
            (item.longDescription && parseHtml(item.longDescription)) ||
            (item.description && parseHtml(item.description))
          }
          images={item.images || [item.imageUrl]}
          subTitle={item.subTitle || item.readingMaterial || item.shortDescription || null}
          tags={isPortalHost ? [allHosts?.find((h) => h.host === item.host)?.name] : null}
          title={item.title || item.label}
        />
      </ModalBody>
    </Modal>
  );
}
