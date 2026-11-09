import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { getHost } from '../_utils/shared';
import Hosts from '../hosts/host';
import Pages from './page';
import { isAdmin } from '../users/user.roles';

Meteor.methods({
  async getPages(hostPredefined) {
    const host = hostPredefined || getHost(this);

    try {
      return await Pages.find(
        {
          host,
        },
        { sort: { order: 1 } }
      ).fetchAsync();
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't get pages");
    }
  },

  async getPage(pageTitleWithId, hostPredefined, isHomePage = false) {
    const host = hostPredefined || getHost(this);

    if (isHomePage) {
      const currentHost = await Hosts.findOneAsync({ host });
      const firstPageInMenu = currentHost?.settings?.menu?.[0];
      return await Pages.findOneAsync({ host, order: 1 });
    }

    if (!pageTitleWithId) {
      throw new Meteor.Error(error, 'Page not found');
    }

    const pageTitleWithIdSplitted = pageTitleWithId.split('--');
    const pageId =
      pageTitleWithIdSplitted?.[pageTitleWithIdSplitted.length - 1];

    console.log('server:', pageTitleWithId, pageTitleWithIdSplitted, pageId);

    if (!pageId) {
      throw new Meteor.Error(error, 'Page not found');
    }

    try {
      return await Pages.findOneAsync({ _id: pageId, host });
    } catch (error) {
      throw new Meteor.Error(error, 'Page not found');
    }
  },

  async getPageTitles(hostPredefined) {
    const host = hostPredefined || getHost(this);

    try {
      return await Pages.find(
        {
          host,
        },
        {
          fields: {
            _id: 1,
            title: 1,
            order: 1,
          },
          sort: { order: 1 },
        }
      ).fetchAsync();
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't get pages");
    }
  },

  async createPage(formValues, hostPredefined) {
    const user = await Meteor.userAsync();
    const host = hostPredefined || getHost(this);

    if (!user || !(await isAdmin(user._id, host))) {
      throw new Meteor.Error('Not allowed!');
    }

    const pageCount = await Pages.find({ host }).countAsync();

    try {
      return await Pages.insertAsync({
        ...formValues,
        host,
        authorId: user._id,
        authorName: user.username,
        isPublished: true,
        order: pageCount + 1,
        creationDate: new Date(),
      });
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't add to Collection");
    }
  },

  async updatePage(pageId, formValues, hostPredefined) {
    const user = await Meteor.userAsync();
    const host = hostPredefined || getHost(this);

    if (!user || !(await isAdmin(user._id, host))) {
      throw new Meteor.Error('Not allowed!');
    }

    check(formValues.title, String);
    check(formValues.longDescription, String);

    const thePage = await Pages.findOneAsync(pageId);
    if (thePage.isTermsPage) {
      throw new Meteor.Error('You cannot update terms page.');
    }

    try {
      await Pages.updateAsync(pageId, {
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

  async savePageOrder(pages) {
    const user = await Meteor.userAsync();
    const host = getHost(this);

    if (!user || !(await isAdmin(user._id, host))) {
      throw new Meteor.Error('Not allowed!');
    }

    if (!pages || !pages.length) {
      throw new Meteor.Error('No pages to update');
    }

    try {
      await Promise.all(
        pages.map(async (page) => {
          await Pages.updateAsync(
            { _id: page._id },
            {
              $set: {
                order: page.order,
              },
            }
          );
        })
      );
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't update collection");
    }
  },

  async deletePage(pageId) {
    const user = await Meteor.userAsync();
    const host = getHost(this);

    if (!user || !(await isAdmin(user._id, host))) {
      throw new Meteor.Error('Not allowed!');
    }

    const thePage = await Pages.findOneAsync(pageId);
    if (thePage.isTermsPage) {
      throw new Meteor.Error('You cannot delete terms page');
    }

    try {
      await Pages.removeAsync(pageId);
      await Pages.updateAsync(
        { host, order: { $gt: thePage.order } },
        { $inc: { order: -1 } },
        { multi: true }
      );
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  },
});
