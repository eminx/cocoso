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

  createPage(formValues, images, hostPredefined) {
    const user = Meteor.user();
    const host = hostPredefined || getHost(this);

    const currentHost = Hosts.findOne({ host });

    if (!user || !isAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      Pages.insert({
        host,
        authorId: user._id,
        authorName: user.username,
        images,
        title: formValues.title,
        longDescription: formValues.longDescription,
        isPublished: true,
        creationDate: new Date(),
      });
      return formValues.title;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't add to Collection");
    }
  },

  updatePage(pageId, formValues, images, hostPredefined) {
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
          title: formValues.title,
          longDescription: formValues.longDescription,
          images,
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

  deletePage(pageId) {
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
      Pages.remove(pageId);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  },
});
