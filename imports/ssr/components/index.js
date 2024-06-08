import React from 'react';
import { useParams } from 'react-router-dom';

import Hosts from '../../api/hosts/host';
import Activities from '../../api/activities/activity';
import Groups from '../../api/groups/group';
import Pages from '../../api/pages/page';
import Resources from '../../api/resources/resource';
import Works from '../../api/works/work';

import Header from './Header';
import Content from './Content';

export function ActivitiesList() {
  Meteor.subscribe('activities');
  const activities = Activities.find().fetch();
  return (
    <>
      <ul>
        {activities.map((a) => (
          <li>{a.title}</li>
        ))}
      </ul>
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

export function GroupsList() {
  Meteor.subscribe('groups');
  const groups = Groups.find().fetch();
  return (
    <>
      <ul>
        {groups.map((a) => (
          <li>{a.title}</li>
        ))}
      </ul>
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

export function Page() {
  const { pageId } = useParams();
  Meteor.subscribe('page', pageId);
  const page = Pages.findOne(pageId);
  Meteor.subscribe('host', page.host);
  const host = Hosts.findOne({ host: page.host });

  return (
    <>
      <Header host={host} />
      <Content
        description={page.longDescription}
        host={host}
        imageUrl={page.images && page.images[0]}
        title={page.title}
      />
    </>
  );
}

export function ResourcesList() {
  Meteor.subscribe('resources');
  const resources = Resources.find().fetch();
  return (
    <>
      <ul>
        {resources.map((a) => (
          <li>{a.label}</li>
        ))}
      </ul>
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

export function WorksList() {
  Meteor.subscribe('works');
  const works = Works.find().fetch();
  return (
    <>
      <ul>
        {works.map((a) => (
          <li>{a.title}</li>
        ))}
      </ul>
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
        description={work.description}
        host={host}
        imageUrl={work.images && work.images[0]}
        subTitle={work.shortDescription}
        title={work.title}
      />
    </>
  );
}

export function UsersList() {
  Meteor.subscribe('membersForPublic');
  const users = Meteor.users.find().fetch();
  return (
    <>
      <ul>
        {users.map((a) => (
          <li>{a.username}</li>
        ))}
      </ul>
    </>
  );
}

export function User() {
  const { username } = useParams();
  Meteor.subscribe('user', username);
  const user = Meteor.users.findOne({ username });

  return (
    <>
      <Content
        description={user.bio}
        imageUrl={user.avatar?.src}
        subTitle={user.firstName ? `${user.firstName} ${user.lastName}` : null}
        title={user.username}
      />
    </>
  );
}
