import { Mongo } from 'meteor/mongo';

Hosts = new Mongo.Collection('hosts');

Activities = new Mongo.Collection('activities');
Gatherings = new Mongo.Collection('gatherings');
Processes = new Mongo.Collection('processes');
Groups = new Mongo.Collection('groups');
Works = new Mongo.Collection('works');
Pages = new Mongo.Collection('pages');

Resources = new Mongo.Collection('resources');
Places = new Mongo.Collection('places');
Chats = new Mongo.Collection('chats');
Images = new Mongo.Collection('images');
Documents = new Mongo.Collection('documents');
