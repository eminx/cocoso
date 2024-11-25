import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Center, Heading, Img, VStack, Wrap } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

import WrapperSSR from './WrapperSSR';
import EntrySSR from './EntrySSR';
import Header from './Header';
import { parseTitle } from '../../ui/utils/shared';

export function Home({ host }) {
  const Host = Meteor.call('getHost', host);
  const pageHeading = Host.settings?.name;

  return (
    <WrapperSSR
      Host={Host}
      imageUrl={Host.logo}
      subTitle={Host.settings?.address}
      title={pageHeading}
    ></WrapperSSR>
  );
}

export function ActivitiesList({ host }) {
  const activities = Meteor.call('getAllPublicActivities', host);
  const Host = Meteor.call('getHost', host);

  const pageHeading = Host.settings?.menu.find((item) => item.name === 'activities')?.label;
  const pageDescription = Host.settings?.menu.find(
    (item) => item.name === 'activities'
  )?.description;
  const metaTitle = `${Host.settings?.name} | ${pageHeading}`;

  return (
    <Box>
      <Header Host={Host} />

      <Center>
        <Heading fontFamily="'Arial', 'sans-serif" textAlign="center">
          {pageHeading}
        </Heading>
      </Center>

      <Gridder items={activities} metaTitle={metaTitle} pageDescription={pageDescription} />
    </Box>
  );
}

export function Activity({ host }) {
  const { activityId } = useParams();
  const activity = Meteor.call('getActivityById', activityId);
  const Host = Meteor.call('getHost', host);

  return (
    <WrapperSSR
      description={activity.longDescription}
      Host={Host}
      isEntryPage
      imageUrl={activity.images && activity.images[0]}
      subTitle={activity.subTitle}
      title={activity.title}
    >
      <EntrySSR
        description={activity.longDescription}
        imageUrl={(activity.images && activity.images[0]) || activity.imageUrl}
        subTitle={activity.subTitle}
        title={activity.title}
      />
    </WrapperSSR>
  );
}

export function GroupsList({ host }) {
  const Host = Meteor.call('getHost', host);
  const groups = Meteor.call('getGroups', Host.isPortalHost, host);

  const pageHeading = Host?.settings?.menu.find((item) => item.name === 'groups')?.label;
  const pageDescription = Host?.settings?.menu.find((item) => item.name === 'groups')?.description;
  const metaTitle = `${Host?.settings?.name} | ${pageHeading}`;

  return (
    <>
      <Header Host={Host} />
      <Center>
        <Heading fontFamily="'Arial', 'sans-serif" textAlign="center">
          {pageHeading}
        </Heading>
      </Center>
      <Gridder items={groups} metaTitle={metaTitle} pageDescription={pageDescription} />
    </>
  );
}

export function Group({ host }) {
  const { groupId } = useParams();
  const group = Meteor.call('getGroup', groupId);
  const Host = Meteor.call('getHost', host);

  return (
    <WrapperSSR
      description={group.description}
      Host={Host}
      isEntryPage
      imageUrl={group.imageUrl}
      subTitle={group.readingMaterial}
      title={group.title}
    >
      <EntrySSR
        description={group.longDescription}
        imageUrl={group.imageUrl}
        subTitle={group.readingMaterial}
        title={group.title}
      />
    </WrapperSSR>
  );
}

export function ResourcesList({ host }) {
  const Host = Meteor.call('getHost', host);
  const resources = Meteor.call('getResources', host);

  const pageHeading = Host?.settings?.menu.find((item) => item.name === 'resources')?.label;
  const pageDescription = Host?.settings?.menu.find(
    (item) => item.name === 'resources'
  )?.description;
  const metaTitle = `${pageHeading} | ${Host.settings?.name}`;

  return (
    <>
      <Header Host={Host} />
      <Center>
        <Heading fontFamily="'Arial', 'sans-serif" textAlign="center">
          {pageHeading}
        </Heading>
      </Center>
      <Gridder metaTitle={metaTitle} items={resources} pageDescription={pageDescription} />
    </>
  );
}

export function Resource({ host }) {
  const { resourceId } = useParams();
  const resource = Meteor.call('getResourceById', resourceId);
  const Host = Meteor.call('getHost', host);

  return (
    <WrapperSSR
      description={resource.description}
      Host={Host}
      isEntryPage
      imageUrl={resource.images && resource.images[0]}
      title={resource.label}
    >
      <EntrySSR
        description={resource.description}
        imageUrl={resource.images && resource.images[0]}
        title={resource.label}
      />
    </WrapperSSR>
  );
}

export function WorksList({ host }) {
  const Host = Meteor.call('getHost', host);
  const works = Meteor.call('getAllWorks', host);

  const pageHeading = Host.settings?.menu.find((item) => item.name === 'works')?.label;
  const pageDescription = Host.settings?.menu.find((item) => item.name === 'works')?.description;
  const metaTitle = `${Host.settings?.name} | ${pageHeading}`;

  return (
    <>
      <Header Host={Host} />
      <Center>
        <Heading fontFamily="'Arial', 'sans-serif" textAlign="center">
          {pageHeading}
        </Heading>
      </Center>
      <Gridder metaTitle={metaTitle} items={works} pageDescription={pageDescription} />
    </>
  );
}

export function Work({ host }) {
  const { workId, usernameSlug } = useParams();
  const [empty, username] = usernameSlug.split('@');
  const work = Meteor.call('getWork', workId, username);
  const Host = Meteor.call('getHost', host);

  return (
    <WrapperSSR
      description={work.longDescription}
      Host={Host}
      isEntryPage
      imageUrl={work.images && work.images[0]}
      subTitle={work.shortDescription}
      title={work.title}
    >
      <EntrySSR
        description={work.longDescription}
        imageUrl={work.images && work.images[0]}
        subTitle={work.shortDescription}
        title={work.title}
      />
    </WrapperSSR>
  );
}

export function Page({ host }) {
  const { pageTitle } = useParams();
  const pages = Meteor.call('getPages', host);
  const page = pages.find((page) => parseTitle(page.title) === pageTitle);
  const Host = Meteor.call('getHost', host);

  return (
    <WrapperSSR
      description={page.longDescription}
      Host={Host}
      imageUrl={page.images && page.images[0]}
      title={page.title}
    >
      <EntrySSR
        description={page.longDescription}
        imageUrl={page.images && page.images[0]}
        title={page.title}
      />
    </WrapperSSR>
  );
}

export function UsersList({ host }) {
  const Host = Meteor.call('getHost', host);
  const users = Meteor.call('getHostMembers', host);

  const pageHeading = Host.settings?.menu.find((item) => item.name === 'people')?.label;
  const pageDescription = Host.settings?.menu.find((item) => item.name === 'people')?.description;
  const metaTitle = `${Host.settings?.name} | ${pageHeading}`;

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{metaTitle}</title>
        <meta name="title" content={metaTitle} />
        <meta property="og:title" content={metaTitle?.substring(0, 30)} />
        <meta property="og:description" content={pageDescription?.substring(0, 60)} />
        <meta property="og:image" content={users.find((u) => u.avatar?.src)?.avatar?.src} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={host.host} />
      </Helmet>

      <Header Host={Host} />
      <Center>
        <Heading fontFamily="'Arial', 'sans-serif" textAlign="center">
          {pageHeading}
        </Heading>
      </Center>
      <Center>
        <Wrap justify="center">
          {users.map((user) => (
            <VStack key={user._id}>
              <Img w={240} h={240} objectFit="cover" src={user.avatar?.src} />
              <Heading fontSize={22}>{user.username}</Heading>
            </VStack>
          ))}
        </Wrap>
      </Center>
    </>
  );
}

export function User({ host }) {
  const Host = Meteor.call('getHost', host);
  const { usernameSlug } = useParams();
  if (usernameSlug[0] !== '@') {
    return null;
  }
  const [empty, username] = usernameSlug.split('@');
  const user = Meteor.call('getUserInfo', username, host);

  return (
    <WrapperSSR
      description={user.bio}
      Host={Host}
      isEntryPage
      imageUrl={user.avatar?.src}
      subTitle={user.firstName ? `${user.firstName} ${user.lastName}` : null}
      title={user.username}
    >
      <EntrySSR
        description={user.bio}
        imageUrl={user.avatar?.src}
        subTitle={user.firstName ? `${user.firstName} ${user.lastName}` : null}
        title={user.username}
      />
    </WrapperSSR>
  );
}

export function Communities({ host }) {
  const allHosts = Meteor.call('getAllHosts');
  const Host = Meteor.call('getHost', host);
  const pageHeading = 'Communities';
  const metaTitle = `${Host?.settings?.name} | ${pageHeading}`;

  return (
    <>
      <Header Host={Host} />
      <Center>
        <Heading fontFamily="'Arial', 'sans-serif" textAlign="center">
          {pageHeading}
        </Heading>
      </Center>
      <Gridder metaTitle={metaTitle} items={allHosts} />
    </>
  );
}

function Gridder({ items, metaTitle, pageDescription }) {
  if (!items) {
    return null;
  }

  const imageUrl =
    items.find((item) => item.imageUrl)?.imageUrl ||
    items.find((item) => {
      if (item.images) {
        return item.images[0];
      } else {
        return null;
      }
    })?.images[0] ||
    null;

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{metaTitle}</title>
        <meta name="title" content={metaTitle} />
        <meta property="og:title" content={metaTitle?.substring(0, 30)} />
        <meta property="og:description" content={pageDescription?.substring(0, 60)} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={items[0]?.host} />
      </Helmet>
      <Center>
        <Wrap justify="center">
          {items.map((item) => (
            <VStack key={item._id} w={360} mb="4">
              <Img
                w={360}
                h={240}
                objectFit="cover"
                src={item.imageUrl || (item.images && item.images[0]) || item.logo}
              />
              <Heading fontSize={18}>{item.title || item.label || item.settings?.name}</Heading>
            </VStack>
          ))}
        </Wrap>
      </Center>
    </>
  );
}
