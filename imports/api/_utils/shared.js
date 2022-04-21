import { Meteor } from 'meteor/meteor';
import Resources from '../resources/resource';

const getHost = (self) => self.connection.httpHeaders.host;

const siteUrl = Meteor.absoluteUrl();

const getResourceIndex = (resource, host) => {
  const resources = Resources.find(
    { host },
    {
      sort: { createdAt: -1 },
      fields: {
        label: 1,
        isCombo: 1,
        resourceIndex: 1,
      },
    }
  ).fetch();

  if (resources.length > 0) {
    const resItem = resources.find((res) => res.label === resource);
    if (resItem?.isCombo) {
      return '99';
    }
    return resItem?.resourceIndex.toString();
  }
};

export { getHost, siteUrl, getResourceIndex };
