import { Meteor } from 'meteor/meteor';

import { getHost } from '../_utils/shared';
import Hosts from '../hosts/host';
import Pages from './page';
import { isAdmin } from '../users/user.roles';

Meteor.methods({
  getPages() {
    const host = getHost(this);

    try {
      return Pages.find({
        host,
      }).fetch();
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't add to Collection");
    }
  },

  createPage(formValues) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user || !isAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      Pages.insert({
        host,
        authorId: user._id,
        authorName: user.username,
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

  updatePage(pageId, formValues) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user || !isAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    check(formValues.title, String);
    check(formValues.longDescription, String);

    try {
      Pages.update(pageId, {
        $set: {
          title: formValues.title,
          longDescription: formValues.longDescription,
          // imageUrl,
          latestUpdate: new Date(),
        },
      });
      return formValues.title;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't add to Collection");
    }
  },

  deletePage(pageId) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user || !isAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      Pages.remove(pageId);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  },
});
