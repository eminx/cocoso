import { Meteor } from 'meteor/meteor';
import Pages from './page';
import { getHost } from '../_utils/shared';

Meteor.publish('pages', () => {
  const host = getHost(this);
  return Pages.find({ host });
});

Meteor.publish('page', (title) => {
  const host = getHost(this);
  return Pages.find({ host, title });
});
