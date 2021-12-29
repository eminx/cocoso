import { Meteor } from 'meteor/meteor';
import Documents from './document';

Meteor.publish('documents', function () {
  return Documents.find();
});