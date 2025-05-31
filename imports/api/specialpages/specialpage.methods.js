import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import SpecialPages from './specialpage';
import Hosts from '../hosts/host';
import { getHost } from '../_utils/shared';
import { isAdmin } from '../users/user.roles';

Meteor.methods({
  async getSpecialPageById(specialPageId, hostPredefined) {
    const host = hostPredefined || getHost(this);

    try {
      return await SpecialPages.findOneAsync(
        {
          _id: specialPageId,
          host,
        },
        {
          fields: {
            _id: 1,
            contentRows: 1,
            host: 1,
            isPublished: 1,
            title: 1,
          },
        }
      );
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async getSpecialPages(hostPredefined) {
    const host = hostPredefined || getHost(this);

    try {
      return await SpecialPages.find({
        host,
      }).fetchAsync();
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async getSpecialPageTitles(hostPredefined) {
    const host = hostPredefined || getHost(this);

    try {
      return await SpecialPages.find(
        {
          host,
        },
        {
          fields: {
            _id: 1,
            host: 1,
            title: 1,
          },
        }
      ).fetchAsync();
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async createSpecialPage(formValues, hostPredefined) {
    const user = Meteor.user();
    const host = hostPredefined || getHost(this);

    const currentHost = await Hosts.findOneAsync({ host });

    if (!user || !isAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      const newId = await SpecialPages.insertAsync({
        ...formValues,
        host,
        authorId: user._id,
        authorName: user.username,
        isPublished: false,
        creationDate: new Date(),
      });
      return newId;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async updateSpecialPage(formValues, hostPredefined) {
    const user = Meteor.user();
    const host = hostPredefined || getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    if (!user || !isAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const specialPageId = formValues._id;
    const thePage = await SpecialPages.findOneAsync(specialPageId);

    if (!thePage) {
      throw new Meteor.Error('Page not found');
    }

    try {
      await SpecialPages.updateAsync(specialPageId, {
        $set: {
          ...formValues,
          latestUpdate: new Date(),
          latestUpdateAuthorId: user._id,
        },
      });
      return formValues.title;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async deleteSpecialPage(specialPageId) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    if (!user || !isAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const thePage = await SpecialPages.findOneAsync(specialPageId);

    if (!thePage) {
      throw new Meteor.Error('Page not found');
    }

    try {
      await SpecialPages.removeAsync(specialPageId);
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
});
