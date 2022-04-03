import React from 'react';
import { Box, Heading, Flex, Tag, Text, Image, Link, Avatar } from '@chakra-ui/react';
import renderHTML from 'react-render-html';

import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import moment from 'moment';
moment.locale(i18n.language);

export default function ResourcesCard({ resource }) {
  const [ t ] = useTranslation('admin');
  return (
    <Box bg="white" mb="2" px="4" py="4" key={resource?.label}>
      <Flex justifyContent="space-between" alignItems="flex-start" mb="4">
        <Heading size="md" fontWeight="bold">
          {resource?.isCombo ? (
            <ResourcesForCombo resource={resource} />
          ) : (
            resource?.label
          )}
        </Heading>
        <Link href={'/@'+resource.user?.username}>
          <Flex alignItems="center">
            <Text 
              fontSize="xs"
              fontWeight="medium"
              textAlign="center"
              mr="2"
              >
              {resource.user?.username}
            </Text>
            <Avatar 
              size="xs"
              name={resource.user?.username}
              src={resource.user?.avatar ? resource.user?.avatar : null}
            />
          </Flex>
        </Link>
      </Flex>
      {resource?.imageUrl && 
        <Box mb="4">
          <Image src={resource?.imageUrl} fit="contain" fill />
        </Box>
      }
      <Box>
        <Text as="p" mb="4">
          <div className="text-content">
              {renderHTML(resource?.description)}{' '}
            </div>
        </Text>
        <Text as="p" fontSize="xs">
          {moment(resource?.createdAt).format('D MMM YYYY')}
        </Text>
      </Box>
    </Box>
  );
}

function ResourcesForCombo({ resource }) {
  const [ t ] = useTranslation('admin');
  const resourcesForCombo = resource?.resourcesForCombo;
  const length = resource?.resourcesForCombo.length;

  return (
    <span>
      <Flex mb="2">
        <Text mr="2">{resource?.label}</Text>
        <Tag size="sm" textTransform="uppercase">{t('resources.cards.ifCombo')}</Tag>
      </Flex>
      {' ['}
      {resourcesForCombo.map((res, i) => (
        <Text as="span" fontSize="sm" key={res._id}>
          {res.label + (i < length - 1 ? ' + ' : '')}
        </Text>
      ))}
      ]
    </span>
  );
}