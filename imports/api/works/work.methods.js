import { Meteor } from 'meteor/meteor';

import { getHost } from '../_utils/shared';
import Works from './work';
import Platform from '../platform/platform';

Meteor.methods({
  async getAllWorksFromAllHosts() {
    try {
      return await Works.find({}, { sort: { creationDate: -1 } }).fetchAsync();
    } catch (error) {
      throw new Meteor.Error(error, 'Could not retrieve data');
    }
  },

  async getAllWorks(hostPredefined) {
    const host = hostPredefined || getHost(this);

    try {
      return await Works.find(
        {
          host,
        },
        { sort: { creationDate: -1 } }
      ).fetchAsync();
    } catch (error) {
      throw new Meteor.Error(error, 'Could not retrieve data');
    }
  },

  async getWorksByUser(username) {
    if (!username) {
      throw new Meteor.Error('Not allowed!');
    }
    const host = getHost(this);
    const platform = Platform.findOne();

    try {
      if (platform.isFederationLayout) {
        return await Works.find({
          authorUsername: username,
        }).fetchAsync();
      }
      return await Works.find({
        host,
        authorUsername: username,
      }).fetchAsync();
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch works");
    }
  },

  async getMyWorks(hostPredefined) {
    const user = await Meteor.userAsync();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }
    const host = hostPredefined || getHost(this);

    try {
      const works = await Works.find({
        host,
        authorId: user._id,
      }).fetchAsync();
      return works;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch works");
    }
  },

  async getWorkById(workId, username) {
    const host = getHost(this);

    try {
      const work = await Works.findOneAsync({ _id: workId, host });
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

  async createWork(values) {
    const user = await Meteor.userAsync();
    if (!user) {
      throw new Meteor.Error('You are not a member anyways!');
    }

    const host = getHost(this);
    const userAvatar = user.avatar ? user.avatar.src : null;

    try {
      const newWorkId = await Works.insertAsync({
        ...values,
        host,
        authorId: user._id,
        authorAvatar: userAvatar,
        authorUsername: user.username,
        creationDate: new Date(),
      });
      return newWorkId;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async updateWork(workId, values) {
    const user = await Meteor.userAsync();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    const theWork = await Works.findOneAsync(workId);

    if (user._id !== theWork.authorId) {
      throw new Meteor.Error('You are not allowed');
    }

    try {
      await Works.updateAsync(workId, {
        $set: {
          ...values,
          latestUpdate: new Date(),
        },
      });
      return values.title;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't add to Collection");
    }
  },

  async deleteWork(workId) {
    const userId = Meteor.userId();

    if (!userId) {
      throw new Meteor.Error('You are not allowed!');
    }

    const work = await Works.findOneAsync(workId);
    if (work.authorId !== userId) {
      throw new Meteor.Error('You are not allowed!');
    }

    try {
      await Works.removeAsync(workId);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  },
});
