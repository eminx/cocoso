import { Meteor } from 'meteor/meteor';
import { getHost } from '../_utils/shared';
import Works from './work';

Meteor.publish('work', id => Works.find({
  _id: id,
}));

Meteor.publish('myworks', function () {
  const currentUserId = Meteor.userId();
  const host = getHost(this);
  // Works._ensureIndex({ host, authorId: currentUserId });
  return Works.find({
    host,
    authorId: currentUserId,
  });
});

Meteor.publish('memberWorksAtHost', function (username) {
  const host = getHost(this);
  return Works.find({
    authorUsername: username,
    host,
  });
});
