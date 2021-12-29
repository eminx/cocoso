import { Meteor } from 'meteor/meteor';
import { getHost } from '../@/shared';
import Resources from './resource';

Meteor.publish('resources', function () {
  const host = getHost(this);
  // Resources._ensureIndex({ host });
  return Resources.find({ host });
});
