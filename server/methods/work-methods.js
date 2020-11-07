import { Meteor } from 'meteor/meteor';
import { getHost } from './shared';

Meteor.methods({
  getAllWorks() {
    const host = getHost(this);

    try {
      const works = Works.find({
        host,
      }).fetch();
      return works;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't add to Collection");
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
      const work = Works.findOne(workId);

      if (work.authorUsername !== username) {
        throw new Meteor.Error('Not allowed!');
      }

      return work;
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

    try {
      const newWorkId = Works.insert({
        ...values,
        host,
        images,
        authorId: user._id,
        userAvatar: user.avatar && user.avatar.src,
        authorUsername: user.username,
        authorFirstName: user.firstName,
        authorLastName: user.lastName,
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
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('You are not allowed!');
    }

    try {
      Works.remove(workId);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  },
});
