import { Meteor } from 'meteor/meteor';

ServiceConfiguration.configurations.remove({
  service: 'google'
});
 
ServiceConfiguration.configurations.insert({
  service: 'google',
  clientId: Meteor.settings.oAuth.google.clientId,
  secret: Meteor.settings.oAuth.google.secret
});