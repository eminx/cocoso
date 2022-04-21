import { Meteor } from 'meteor/meteor';
import Pages from './page';
import { getHost } from '../_utils/shared';

Meteor.publish('pages', function () {
  const host = getHost(this);
  return Pages.find({ host });
});

Meteor.publish('page', function (title) {
  const host = getHost(this);
  return Pages.find({ host, title });
});
