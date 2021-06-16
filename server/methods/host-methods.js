import { Meteor } from 'meteor/meteor';

import { defaultMenu, defaultMainColor } from '../../lib/constants';

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

      await Meteor.users.update(currentUser._id, {
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
