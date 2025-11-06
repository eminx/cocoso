import { Meteor } from 'meteor/meteor';

import { getHost } from '../_utils/shared';
import Groups from './group';

Meteor.publish('groups', function () {
  const userId = this.userId;
  const host = getHost(this);
  // Groups._ensureIndex({ host, isPublished: true });

  const fields = {
    title: 1,
    readingMaterial: 1,
    imageUrl: 1,
    meetings: 1,
    adminUsername: 1,
    adminId: 1,
    isArchived: 1,
  };
  if (userId) {
    fields.members = 1;
    fields.peopleInvited = 1;
  }

  return Groups.find(
    {
      host,
      isPublished: true,
    },
    {
      fields,
      sort: { creationDate: 1 },
    }
  );
});

Meteor.publish('group', function (id) {
  // const host = getHost(this);
  return Groups.find({
    // host,
    _id: id,
  });
});
