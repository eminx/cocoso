import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Center, Heading, Img, VStack, Wrap } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

import Hosts from '../../api/hosts/host';
import Activities from '../../api/activities/activity';
import Groups from '../../api/groups/group';
import Pages from '../../api/pages/page';
import Resources from '../../api/resources/resource';
import Works from '../../api/works/work';

import Header from './Header';
import Content from './Content';
import { parseTitle } from '../../ui/utils/shared';

export function ActivitiesList({ host }) {
  Meteor.subscribe('activities', true);
  const activities = Activities.find({ host, isPublicActivity: true }).fetch();
  Meteor.subscribe('host', host);
  const Host = Hosts.findOne({ host });
  const pageHeading = Host.settings?.menu.find((item) => item.name === 'activities')?.label;
  const pageDescription = Host.settings?.menu.find(
    (item) => item.name === 'activities'
  )?.description;

  const metaTitle = `${Host.settings?.name} | ${pageHeading}`;
  return (
    <>
      <Header host={Host} />
      <Center>
        <Heading fontFamily="'Arial', 'sans-serif" textAlign="center">
          {pageHeading}
        </Heading>
      </Center>
      <Gridder metaTitle={metaTitle} items={activities} pageDescription={pageDescription} />
    </>
  );
}

export function Activity() {
  const { activityId } = useParams();

  Meteor.subscribe('activity', activityId);
  const activity = Activities.findOne(activityId);
  Meteor.subscribe('host', activity.host);
  const host = Hosts.findOne({ host: activity.host });

  return (
    <>
      <Header host={host} />
      <Content
        description={activity.longDescription}
        host={host}
        imageUrl={activity.imageUrl}
        subTitle={activity.subTitle}
        title={activity.title}
      />
    </>
  );
}

export function Communities() {
  Meteor.subscribe('hosts');
  const hosts = Hosts.find().fetch();
  const Host = hosts.find((h) => h.isPortalHost);
  const pageHeading = 'Communities';
  const metaTitle = `${Host.settings?.name} | ${pageHeading}`;

  return (
    <>
      <Header host={Host} />
      <Center>
        <Heading fontFamily="'Arial', 'sans-serif" textAlign="center">
          {pageHeading}
        </Heading>
      </Center>
      <Gridder metaTitle={metaTitle} items={hosts} />
    </>
  );
}

export function Home({ host }) {
  const Host = Hosts.findOne({ host });
  const pageHeading = Host.settings?.name;

  return (
    <>
      <Header host={Host} />
      <Content
        host={Host}
        imageUrl={Host.logo}
        subTitle={Host.settings?.address}
        title={pageHeading}
      />
    </>
  );
}

export function GroupsList({ host }) {
  Meteor.subscribe('groups');
  const groups = Groups.find({ host }).fetch();
  Meteor.subscribe('host', host);
  const Host = Hosts.findOne({ host });
  const pageHeading = Host?.settings?.menu.find((item) => item.name === 'groups')?.label;
  const pageDescription = Host?.settings?.menu.find((item) => item.name === 'groups')?.description;
  const metaTitle = `${Host?.settings?.name} | ${pageHeading}`;

  return (
    <>
      <Header host={Host} />
      <Center>
        <Heading fontFamily="'Arial', 'sans-serif" textAlign="center">
          {pageHeading}
        </Heading>
      </Center>
      <Gridder metaTitle={metaTitle} items={groups} pageDescription={pageDescription} />
    </>
  );
}

export function Group() {
  const { groupId } = useParams();
  Meteor.subscribe('group', groupId);
  const group = Groups.findOne(groupId);
  Meteor.subscribe('host', group.host);
  const host = Hosts.findOne({ host: group.host });

  return (
    <>
      <Header host={host} />
      <Content
        description={group.description}
        host={host}
        imageUrl={group.imageUrl}
        subTitle={group.readingMaterial}
        title={group.title}
      />
    </>
  );
}

export function Page({ host }) {
  const { pageTitle } = useParams();
  Meteor.subscribe('pages');
  const pages = Pages.find({ host }).fetch();
  const page = pages.find((page) => parseTitle(page.title) === pageTitle);
  page && Meteor.subscribe('host', page.host);
  const Host = Hosts.findOne({ host: page.host });

  return (
    <>
      <Header host={Host} />
      <Content
        description={page.longDescription}
        host={Host}
        imageUrl={page.images && page.images[0]}
        title={page.title}
      />
    </>
  );
}

export function ResourcesList({ host }) {
  Meteor.subscribe('resources');
  const resources = Resources.find({ host }).fetch();
  Meteor.subscribe('host', host);
  const Host = Hosts.findOne({ host });
  const pageHeading = Host.settings?.menu.find((item) => item.name === 'resources')?.label;
  const pageDescription = Host.settings?.menu.find(
    (item) => item.name === 'resources'
  )?.description;
  const metaTitle = `${Host.settings?.name} | ${pageHeading}`;

  return (
    <>
      <Header host={Host} />
      <Center>
        <Heading fontFamily="'Arial', 'sans-serif" textAlign="center">
          {pageHeading}
        </Heading>
      </Center>
      <Gridder metaTitle={metaTitle} items={resources} pageDescription={pageDescription} />
    </>
  );
}

export function Resource() {
  const { resourceId } = useParams();
  Meteor.subscribe('resource', resourceId);
  const resource = Resources.findOne(resourceId);
  Meteor.subscribe('host', resource.host);
  const host = Hosts.findOne({ host: resource.host });

  return (
    <>
      <Header host={host} />
      <Content
        description={resource.description}
        host={host}
        imageUrl={resource.images && resource.images[0]}
        title={resource.label}
      />
    </>
  );
}

export function WorksList({ host }) {
  Meteor.subscribe('works');
  const works = Works.find({ host }).fetch();
  Meteor.subscribe('host', host);
  const Host = Hosts.findOne({ host });
  const pageHeading = Host.settings?.menu.find((item) => item.name === 'works')?.label;
  const pageDescription = Host.settings?.menu.find((item) => item.name === 'works')?.description;
  const metaTitle = `${Host.settings?.name} | ${pageHeading}`;

  return (
    <>
      <Header host={Host} />
      <Center>
        <Heading fontFamily="'Arial', 'sans-serif" textAlign="center">
          {pageHeading}
        </Heading>
      </Center>
      <Gridder metaTitle={metaTitle} items={works} pageDescription={pageDescription} />
    </>
  );
}

export function Work() {
  const { workId } = useParams();
  Meteor.subscribe('work', workId);
  const work = Works.findOne(workId);
  Meteor.subscribe('host', work.host);
  const host = Hosts.findOne({ host: work.host });

  return (
    <>
      <Header host={host} />
      <Content
        description={work.longDescription}
        host={host}
        imageUrl={work.images && work.images[0]}
        subTitle={work.shortDescription}
        title={work.title}
      />
    </>
  );
}

export function UsersList({ host }) {
  Meteor.subscribe('membersForPublic');
  Meteor.subscribe('currentHost');
  const Host = Hosts.findOne({ host });
  const users = Meteor.users.find({ 'memberships.host': host }).fetch();
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

      <Header host={Host} />
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

export function User() {
  const { username } = useParams();
  Meteor.subscribe('user', username);
  const user = Meteor.users.findOne({ username });
  Meteor.subscribe('currentHost');
  const host = Hosts.findOne();

  return (
    <>
      <Header host={host} />
      <Content
        description={user.bio}
        imageUrl={user.avatar?.src}
        host={host}
        subTitle={user.firstName ? `${user.firstName} ${user.lastName}` : null}
        title={user.username}
      />
    </>
  );
}

function Gridder({ items, metaTitle, pageDescription }) {
  if (!items) {
    return null;
  }

  const imageUrl =
    items.find((item) => item.imageUrl)?.imageUrl ||
    items.find((item) => item.images)?.images[0] ||
    items.find((i) => i.isPortalHost).logo;

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
            <VStack key={item._id} w={400}>
              <Img
                w={360}
                h={240}
                objectFit="cover"
                src={item.imageUrl || (item.images && item.images[0]) || item.logo}
              />
              <Heading fontSize={22}>{item.title || item.label || item.settings?.name}</Heading>
            </VStack>
          ))}
        </Wrap>
      </Center>
    </>
  );
}
