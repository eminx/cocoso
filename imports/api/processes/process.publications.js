import { Meteor } from 'meteor/meteor';

import { getHost } from '../_utils/shared';
import Processes from './process';

Meteor.publish('processes', function () {
  const userId = Meteor.userId();
  const host = getHost(this);
  // Processes._ensureIndex({ host, isPublished: true });

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

  return Processes.find(
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

Meteor.publish('process', function (id) {
  const host = getHost(this);
  return Processes.find({
    host,
    _id: id,
  });
});
