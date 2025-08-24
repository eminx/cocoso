import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import ComposablePages from './composablepage';
import Hosts from '../hosts/host';
import { getHost } from '../_utils/shared';
import { isAdmin } from '../users/user.roles';

Meteor.methods({
  async getComposablePageById(composablePageId, hostPredefined) {
    const host = hostPredefined || getHost(this);

    try {
      return await ComposablePages.findOneAsync(
        {
          _id: composablePageId,
          host,
        },
        {
          fields: {
            _id: 1,
            authorUsername: 1,
            authorName: 1,
            contentRows: 1,
            host: 1,
            isPublished: 1,
            settings: 1,
            title: 1,
          },
        }
      );
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async getComposablePages(hostPredefined) {
    const host = hostPredefined || getHost(this);

    try {
      return await ComposablePages.find({
        host,
      }).fetchAsync();
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async getComposablePageTitles(hostPredefined) {
    const host = hostPredefined || getHost(this);

    try {
      return await ComposablePages.find(
        {
          host,
        },
        {
          sort: {
            latestUpdate: -1,
          },
          fields: {
            _id: 1,
            authorName: 1,
            authorUsername: 1,
            creationDate: 1,
            host: 1,
            isPublished: 1,
            latestUpdate: 1,
            latestUpdateAuthorUsername: 1,
            title: 1,
          },
        }
      ).fetchAsync();
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async createComposablePage(formValues, hostPredefined) {
    const user = Meteor.user();
    const host = hostPredefined || getHost(this);

    const currentHost = await Hosts.findOneAsync({ host });

    if (!user || !isAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      const newId = await ComposablePages.insertAsync({
        ...formValues,
        contentRows: [],
        settings: {
          hideTitle: false,
          hideMenu: false,
        },
        host,
        authorId: user._id,
        authorUsername: user.username,
        isPublished: false,
        creationDate: new Date(),
        latestUpdate: new Date(),
      });
      return newId;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async updateComposablePage(formValues, hostPredefined) {
    const user = Meteor.user();
    const host = hostPredefined || getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    if (!user || !isAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const composablePageId = formValues._id;
    const thePage = await ComposablePages.findOneAsync(composablePageId);

    if (!thePage) {
      throw new Meteor.Error('Page not found');
    }

    try {
      await ComposablePages.updateAsync(composablePageId, {
        $set: {
          ...formValues,
          latestUpdate: new Date(),
          latestUpdateAuthorId: user._id,
          latestUpdateAuthorUsername: user.username,
        },
      });
      return formValues.title;
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  async publishComposablePage(composablePageId) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    if (!user || !isAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      await ComposablePages.updateAsync(composablePageId, {
        $set: {
          isPublished: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  async unpublishComposablePage(composablePageId) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    if (!user || !isAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      await ComposablePages.updateAsync(composablePageId, {
        $set: {
          isPublished: false,
        },
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async deleteComposablePage(composablePageId) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    if (!user || !isAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const thePage = await ComposablePages.findOneAsync(composablePageId);

    if (!thePage) {
      throw new Meteor.Error('Page not found');
    }

    try {
      await ComposablePages.removeAsync(composablePageId);
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
});
