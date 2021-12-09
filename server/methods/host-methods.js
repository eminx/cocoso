import { Meteor } from 'meteor/meteor';

import {
  defaultMenu,
  defaultMainColor,
  defaultEmails,
} from '../../lib/constants';

Meteor.methods({
  async createNewHost(values) {
    const currentUser = Meteor.user();
    if (!currentUser || !currentUser.isSuperAdmin) {
      throw new Meteor.Error('You are not allowed!');
    }

    if (Hosts.findOne({ host: values.host })) {
      throw new Meteor.Error('A hub with this url already exists');
    }

    try {
      const hostId = await Hosts.insert({
        host: values.host,
        email: values.email,
        settings: {
          address: values.address,
          city: values.city,
          country: values.country,
          email: values.email,
          mainColor: defaultMainColor,
          menu: defaultMenu,
          name: values.name,
        },
        members: [
          {
            username: currentUser.username,
            id: currentUser._id,
            email: currentUser.emails[0].address,
            role: 'admin',
            date: new Date(),
          },
        ],
        emails: defaultEmails,
      });

      await Pages.insert({
        host: values.host,
        authorId: currentUser._id,
        authorName: currentUser.username,
        title: `About ${values.name}`,
        longDescription: values.about,
        isPublished: true,
        creationDate: new Date(),
      });

      Meteor.users.update(currentUser._id, {
        $push: {
          memberships: {
            host: values.host,
            hostId: hostId,
            role: 'admin',
            date: new Date(),
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },
});
