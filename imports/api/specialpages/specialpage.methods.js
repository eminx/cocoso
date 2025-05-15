import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import SpecialPages from './specialpage';
import Hosts from '../hosts/host';
import { getHost } from '../_utils/shared';
import { isAdmin } from '../users/user.roles';

Meteor.methods({
  async getSpecialPages(hostPredefined) {
    const host = hostPredefined || getHost(this);

    try {
      return await SpecialPages.find({
        host,
      }).fetchAsync();
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't get pages");
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
            title: 1,
          },
        }
      ).fetchAsync();
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't get pages");
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
      await SpecialPages.insertAsync({
        ...formValues,
        host,
        authorId: user._id,
        authorName: user.username,
        isPublished: true,
        creationDate: new Date(),
      });
      return formValues.title;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't add to Collection");
    }
  },

  async updateSpecialPage(specialPageId, formValues, hostPredefined) {
    const user = Meteor.user();
    const host = hostPredefined || getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    if (!user || !isAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const thePage = await SpecialPages.findOneAsync(specialPageId);
    if (thePage.isTermsPage) {
      throw new Meteor.Error('You cannot update terms page.');
    }

    try {
      await SpecialPages.updateAsync(specialPageId, {
        $set: {
          ...formValues,
          latestUpdate: new Date(),
        },
      });
      return formValues.title;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't add to Collection");
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
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  },
});
