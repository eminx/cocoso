import React, { useContext, useState } from 'react';
import { Box, Flex, ModalBody } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import parseHtml from 'html-react-parser';

import Modal from '../components/Modal';
import Tably from '../components/Tably';
import { useTranslation } from 'react-i18next';
import { StateContext } from '../LayoutContainer';
import { DateJust } from '../components/FancyDate';

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
    const link = `https://${item.host}/activities/${item._id}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleActionButtonClick = () => {
    if (item.host === currentHost.host) {
      navigate(`/${kind}/${item._id}/info`);
    } else {
      window.location.href = `https://${item.host}/${kind}/${item._id}/info`;
    }
  };

  return (
    <Modal
      actionButtonLabel={getButtonLabel()}
      isCentered
      isOpen={item}
      scrollBehavior="inside"
      secondaryButtonLabel={copied ? tc('actions.copied') : tc('actions.share')}
      size="xl"
      onActionButtonClick={() => handleActionButtonClick()}
      onClose={onClose}
      onSecondaryButtonClick={handleCopyLink}
    >
      <ModalBody p="0">
        <Tably
          action={getDatesForAction(item)}
          content={
            (item.longDescription && parseHtml(item.longDescription)) ||
            (item.description && parseHtml(item.description))
          }
          images={item.images || [item.imageUrl]}
          subTitle={item.subTitle || item.readingMaterial || item.shortDescription || null}
          tags={isPortalHost && [allHosts?.find((h) => h.host === item.host)?.name]}
          title={item.title || item.name}
        />
      </ModalBody>
    </Modal>
  );
}

function getDatesForAction(activity, showPast = false) {
  if (!activity.datesAndTimes) {
    return null;
  }

  const dates = showPast
    ? getPastOccurrences(activity.datesAndTimes)
    : getFutureOccurrences(activity.datesAndTimes);

  return (
    <Flex pt="4">
      {dates.map(
        (occurence, occurenceIndex) =>
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

const yesterday = dayjs().add(-1, 'days');
const today = dayjs();

const getFutureOccurrences = (dates) => {
  return dates
    .filter((date) => date && dayjs(date.endDate)?.isAfter(yesterday))
    .sort((a, b) => dayjs(a?.startDate) - dayjs(b?.startDate));
};

const getPastOccurrences = (dates) => {
  return dates
    .filter((date) => dayjs(date.startDate)?.isBefore(today))
    .sort((a, b) => dayjs(b.startDate) - dayjs(a.startDate));
};
