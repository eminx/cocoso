import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { getHost } from '../_utils/shared';
import Hosts from '../hosts/host';
import Pages from './page';
import { isAdmin } from '../users/user.roles';

Meteor.methods({
  getPages(hostPredefined) {
    const host = hostPredefined || getHost(this);

    try {
      return Pages.find(
        {
          host,
        },
        { sort: { order: 1 } }
      ).fetch();
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't get pages");
    }
  },

  getPageTitles(hostPredefined) {
    const host = hostPredefined || getHost(this);

    try {
      return Pages.find(
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
      ).fetch();
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't get pages");
    }
  },

  getPortalHostPages() {
    const portalHost = Hosts.findOne({ isPortalHost: true });
    return Pages.find({ host: portalHost.host }, { sort: { creationDate: -1 } }).fetch();
  },

  createPage(formValues, hostPredefined) {
    const user = Meteor.user();
    const host = hostPredefined || getHost(this);

    const currentHost = Hosts.findOne({ host });

    if (!user || !isAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const pageCount = Pages.find({ host }).count();

    try {
      Pages.insert({
        ...formValues,
        host,
        authorId: user._id,
        authorName: user.username,
        isPublished: true,
        order: pageCount + 1,
        creationDate: new Date(),
      });
      return formValues.title;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't add to Collection");
    }
  },

  updatePage(pageId, formValues, hostPredefined) {
    const user = Meteor.user();
    const host = hostPredefined || getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user || !isAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    check(formValues.title, String);
    check(formValues.longDescription, String);

    const thePage = Pages.find(pageId);
    if (thePage.isTermsPage) {
      throw new Meteor.Error('You cannot update terms page.');
    }

    try {
      Pages.update(pageId, {
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
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user || !isAdmin(user, currentHost)) {
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
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user || !isAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const thePage = Pages.find(pageId);
    if (thePage.isTermsPage) {
      throw new Meteor.Error('You cannot delete terms page');
    }

    try {
      await Pages.removeAsync(pageId);
      let order = 1;
      Pages.find({ host }, { sort: { order: 1 } }).forEach((page) => {
        Pages.update({ _id: page._id }, { $set: { order } });
        order += 1;
      });
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  },
});
