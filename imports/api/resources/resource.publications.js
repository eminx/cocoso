import { Meteor } from 'meteor/meteor';
import { getHost } from '../_utils/shared';
import Resources from './resource';

Meteor.publish('resources', () => {
  const host = getHost(this);
  // Resources._ensureIndex({ host });
  return Resources.find({ host });
});
