import { Meteor } from 'meteor/meteor';

import { getHost } from '../_utils/shared';
import Works from './work';

Meteor.methods({
  getAllWorksFromAllHosts() {
    try {
      return Works.find().fetch();
    } catch (error) {
      throw new Meteor.Error(error, 'Could not retrieve data');
    }
  },

  getAllWorks() {
    const host = getHost(this);
    try {
      const works = Works.find({
        host,
      }).fetch();

      return works;
    } catch (error) {
      throw new Meteor.Error(error, 'Could not retrieve data');
    }
  },

  getWorksByUser(username) {
    if (!username) {
      throw new Meteor.Error('Not allowed!');
    }
    const host = getHost(this);

    try {
      const works = Works.find({
        host,
        authorUsername: username,
      }).fetch();
      return works;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch works");
    }
  },

  getMyWorks() {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }
    const host = getHost(this);

    try {
      const works = Works.find({
        host,
        authorId: user._id,
      }).fetch();
      return works;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch works");
    }
  },

  getWork(workId, username) {
    const host = getHost(this);

    try {
      const work = Works.findOne({ _id: workId, host });

      if (work.authorUsername !== username) {
        throw new Meteor.Error('Not allowed!');
      }

      return {
        ...work,
      };
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  createWork(values, images) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('You are not a member anyways!');
    }

    const host = getHost(this);
    const userAvatar = user.avatar ? user.avatar.src : null;

    try {
      const newWorkId = Works.insert({
        ...values,
        host,
        images,
        authorId: user._id,
        authorAvatar: userAvatar,
        authorUsername: user.username,
        creationDate: new Date(),
      });
      return newWorkId;
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  updateWork(workId, values, images) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      Works.update(workId, {
        $set: {
          ...values,
          images,
          latestUpdate: new Date(),
        },
      });
      return values.title;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't add to Collection");
    }
  },

  deleteWork(workId) {
    const userId = Meteor.userId();

    if (!userId) {
      throw new Meteor.Error('You are not allowed!');
    }

    const work = Works.findOne(workId);
    if (work.authorId !== userId) {
      throw new Meteor.Error('You are not allowed!');
    }

    try {
      Works.remove(workId);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  },
});
