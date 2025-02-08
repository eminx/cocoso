import { Meteor } from 'meteor/meteor';
import Resources from '../resources/resource';

const getHost = (self) => self?.connection?.httpHeaders?.host;

const siteUrl = Meteor.absoluteUrl();

export { getHost, siteUrl };
