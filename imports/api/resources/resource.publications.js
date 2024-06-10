import { Meteor } from 'meteor/meteor';
import { getHost } from '../_utils/shared';
import Resources from './resource';

Meteor.publish('resources', function () {
  const host = getHost(this);
  // Resources._ensureIndex({ host });
  return Resources.find(
    { host },
    {
      fields: {
        _id,
        host: 1,
        images: 1,
        label: 1,
      },
    }
  );
});

Meteor.publish('resource', function (id) {
  return Resources.find(
    { _id: id },
    {
      fields: {
        _id: 1,
        bookings: 1,
        description: 1,
        host: 1,
        images: 1,
        label: 1,
      },
    }
  );
});
