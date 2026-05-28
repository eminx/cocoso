import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import parseHtml from 'html-react-parser';
import { useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';

import { Box, Center, Flex, Heading, Modal, Tag } from '/imports/ui/core';
import { allHostsAtom } from '../../state';
import { currentHostAtom } from '/imports/state';

import ActionDates from '../entry/ActionDates';
import NiceSlider from '../generic/NiceSlider';

interface PopupHeaderProps {
  subTitle?: string;
  tags?: string[];
  title: string;
}

function PopupHeader({ subTitle, tags, title }: PopupHeaderProps) {
  const fontFamily = "'Raleway', sans-serif";

  const styles = {
    lineHeight: 1,
    textAlign: 'center',
    textShadow: '1px 1px 1px #fff',
    margin: '0.5rem',
  };

  return (
    <Box mb="4">
      <Heading
        as="h1"
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

interface PopupContentProps {
  action?: React.ReactNode;
  content?: React.ReactNode;
  images?: string[];
  subTitle?: string;
  title: string;
  tags?: string[];
}

function PopupContent({
  action = null,
  content,
  images,
  subTitle,
  title,
  tags,
}: PopupContentProps) {
  return (
    <Box css={{ overflowX: 'hidden' }}>
      <PopupHeader subTitle={subTitle} tags={tags} title={title} />
      <Center mb="4" mx="4" w="auto">
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

const getLinkPath = (item: any, kind: string, isAnotherHost = false) => {
  if (isAnotherHost) {
    if (kind === 'works') {
      return {
        isHref: false,
        path: `/@${item.authorUsername}/${kind}/${item._id}`,
      };
    }
    return {
      isHref: false,
      path: `/${kind}/${item._id}`,
    };
  }
  if (kind === 'works') {
    return {
      isHref: true,
      path: `https://${item.host}/@${item.authorUsername}/${kind}/${item._id}`,
    };
  }
  return {
    isHref: true,
    path: `https://${item.host}/${kind}/${item._id}`,
  };
};

export interface PopupHandlerProps {
  item: any;
  kind: string;
  showPast?: boolean;
  onClose: () => void;
}

export default function PopupHandler({ item, kind, showPast, onClose }: PopupHandlerProps) {
  const allHosts = useAtomValue(allHostsAtom);
  const currentHost = useAtomValue(currentHostAtom);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const [tc] = useTranslation('common');

  const [displayedItem, setDisplayedItem] = useState(item);
  const lingerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (item) {
      if (lingerRef.current) clearTimeout(lingerRef.current);
      setDisplayedItem(item);
    } else {
      lingerRef.current = setTimeout(() => setDisplayedItem(null), 350);
    }
    return () => {
      if (lingerRef.current) clearTimeout(lingerRef.current);
    };
  }, [item]);

  const isPortalHost = currentHost?.isPortalHost;

  const getButtonLabel = () => {
    const hostName = allHosts?.find((h) => h?.host === displayedItem?.host)?.name;
    if (isPortalHost) {
      return tc('actions.toThePage', {
        hostName,
      });
    }
    return tc('actions.entryPage');
  };

  const handleCopyLink = async () => {
    if (!displayedItem) return;
    const link = getLinkPath(displayedItem, kind);
    await navigator.clipboard.writeText(link.path);
    setCopied(true);
  };

  const handleActionButtonClick = () => {
    if (!displayedItem) return;
    const link = getLinkPath(displayedItem, kind, displayedItem.host === currentHost?.host);
    if (link.isHref) {
      window.open(link.path, '_self');
      return;
    }
    navigate(link.path);
  };

  const tags = [];
  if (isPortalHost && displayedItem) {
    const hostName = allHosts?.find((h) => h.host === displayedItem.host)?.name;
    tags.push(hostName);
  }
  if (displayedItem?.isPrivate) {
    tags.push(tc('labels.private'));
  }

  return (
    <Modal
      cancelText={copied ? tc('actions.copied') : tc('actions.share')}
      confirmText={getButtonLabel()}
      hideHeader
      id="popup-handler"
      open={Boolean(item)}
      size="xl"
      onConfirm={handleActionButtonClick}
      onClose={onClose}
      onSecondaryButtonClick={handleCopyLink}
    >
      {displayedItem && (
        <PopupContent
          action={<ActionDates activity={displayedItem} showPast={showPast} showTime />}
          content={
            (displayedItem.longDescription && parseHtml(displayedItem.longDescription)) ||
            (displayedItem.description && parseHtml(displayedItem.description))
          }
          images={displayedItem.images || [displayedItem.imageUrl]}
          subTitle={
            displayedItem.subTitle ||
            displayedItem.readingMaterial ||
            displayedItem.shortDescription ||
            null
          }
          tags={tags}
          title={displayedItem.title || displayedItem.label}
        />
      )}
    </Modal>
  );
}
