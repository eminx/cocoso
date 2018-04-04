import { Meteor } from 'meteor/meteor';

ServiceConfiguration.configurations.remove({
  service: "facebook"
});

ServiceConfiguration.configurations.insert({
  service: "facebook",
  appId: Meteor.settings.oAuth.facebook.appId,
  secret: Meteor.settings.oAuth.facebook.secret
});