import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import parseHtml from 'html-react-parser';
import { useTranslation } from 'react-i18next';

import { Box, Center, Flex, Heading, Modal, Tag } from '/imports/ui/core';
import { StateContext } from '/imports/ui/LayoutContainer';

import ActionDates from '../entry/ActionDates';
import NiceSlider from '../generic/NiceSlider';

function PopupHeader({ subTitle, tags, title }) {
  const fontFamily = "'Raleway', sans-serif";

  const styles = {
    lineHeight: 1,
    textAlign: 'center',
    textShadow: '1px 1px 1px #fff',
  };

  return (
    <Box mb="4">
      <Heading
        as="h1"
        mb="2"
        css={{
          ...styles,
          fontFamily,
          fontSize: '1.8rem',
        }}
      >
        {title}
      </Heading>
      {subTitle && (
        <Heading
          as="h2"
          css={{
            ...styles,
            fontSize: '1.3rem',
            fontWeight: '300',
          }}
        >
          {subTitle}
        </Heading>
      )}
      {tags && tags.length > 0 && (
        <Flex justify="center" pt="2">
          {tags.map(
            (tag) =>
              tag && (
                <Tag key={tag} colorScheme="gray" size="sm">
                  {tag}
                </Tag>
              )
          )}
        </Flex>
      )}
    </Box>
  );
}

function PopupContent({
  action = null,
  content,
  images,
  subTitle,
  title,
  tags,
}) {
  return (
    <Box css={{ overflowX: 'hidden' }}>
      <PopupHeader subTitle={subTitle} tags={tags} title={title} />
      <Center mb="4" mx="4">
        {action}
      </Center>
      <Center mb="4">
        <NiceSlider alt={title} images={images} isFade={false} />
      </Center>

      <Box bg="white" className="text-content" p="4">
        {content}
      </Box>
    </Box>
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

export default function PopupHandler({ item, kind, showPast, onClose }) {
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
    await navigator.clipboard.writeText(link.path);
    setCopied(true);
  };

  const handleActionButtonClick = () => {
    const link = getLinkPath(item, kind, item.host === currentHost.host);
    if (link.isHref) {
      window.open(link.path, '_self');
      return;
    }
    navigate(link.path);
  };

  const tags = [];
  if (isPortalHost) {
    const hostName = allHosts?.find((h) => h.host === item.host)?.name;
    tags.push(hostName);
  }
  if (item.isPrivate) {
    tags.push(tc('labels.private'));
  }

  return (
    <Modal
      confirmText={getButtonLabel()}
      hideHeader
      open={item}
      cancelText={copied ? tc('actions.copied') : tc('actions.share')}
      size="xl"
      onConfirm={() => handleActionButtonClick()}
      onClose={onClose}
      onSecondaryButtonClick={handleCopyLink}
    >
      <PopupContent
        action={<ActionDates activity={item} showPast={showPast} showTime />}
        content={
          (item.longDescription && parseHtml(item.longDescription)) ||
          (item.description && parseHtml(item.description))
        }
        images={item.images || [item.imageUrl]}
        subTitle={
          item.subTitle || item.readingMaterial || item.shortDescription || null
        }
        tags={tags}
        title={item.title || item.label}
      />
    </Modal>
  );
}
