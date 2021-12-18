import { Meteor } from 'meteor/meteor';
import { getHost } from './shared';

Meteor.publish('activities', function (onlyPublic = false) {
  const host = getHost(this);
  // const fields = {
  //   title: 1,
  //   datesAndTimes: 1,
  //   roomIndex: 1,
  //   room: 1,
  //   place: 1,
  //   isPublicActivity: 1,
  //   authorName: 1,
  // };
  // const publicFields = {
  //   title: 1,
  //   subTitle: 1,
  //   imageUrl: 1,
  //   datesAndTimes: 1,
  //   isPublicActivity: 1,
  // };

  // Activities._ensureIndex({ host, isPublished: true });

  if (onlyPublic) {
    return Activities.find(
      {
        host,
        isPublished: true,
        isPublicActivity: true,
      }
      // { fields: publicFields }
    );
  } else {
    return Activities.find({ host, isPublished: true });
  }
});



Meteor.publish('activity', function (id) {
  const host = getHost(this);
  return Activities.find({
    host,
    _id: id,
  });
});

Meteor.publish('chat', function (contextId) {
  const host = getHost(this);
  const user = Meteor.user();
  if (user) {
    return Chats.find({
      contextId: contextId,
    });
  }
});

Meteor.publish('resources', function () {
  const host = getHost(this);
  // Resources._ensureIndex({ host });
  return Resources.find({ host });
});
