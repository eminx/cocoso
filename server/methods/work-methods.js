import { Meteor } from 'meteor/meteor';
import { getHost } from './shared';

Meteor.methods({
  getMyWorks() {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }
    const host = getHost(this);

    try {
      const works = Works.find({
        host,
        authorId: user._id
      }).fetch();
      return works;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't add to Collection");
    }
  },

  getWork(workId, username) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }
    const host = getHost(this);

    try {
      const work = Works.findOne({
        host,
        authorId: user._id,
        _id: workId
      });

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
        authorAvatar: user.avatar || '',
        authorUsername: user.username,
        authorFirstName: user.firstName,
        authorLastName: user.lastName
      });
      return newWorkId;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  updateWork(workId, formValues) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    check(formValues.title, String);
    check(formValues.longDescription, String);
    // check(imageUrl, String);

    try {
      Works.update(workId, {
        $set: {
          title: formValues.title,
          longDescription: formValues.longDescription,
          // imageUrl,
          latestUpdate: new Date()
        }
      });
      return formValues.title;
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
  }
});
