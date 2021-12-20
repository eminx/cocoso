const getHost = (self) => self.connection.httpHeaders.host;

const siteUrl = Meteor.absoluteUrl();

const getResourceIndex = (resource, host) => {
  import Resources from "../resources/resource";
  const resources = Resources.find(
    { host },
    { sort: { creationDate: 1 } }
  ).fetch();

  console.log(resource);

  if (resources.length > 0) {
    const resItem = resources.find((res) => res.label === resource);
    if (resItem.isCombo) {
      return '99';
    }
    return resItem.resourceIndex.toString();
  }
};

export { 
  getHost, 
  siteUrl, 
  getResourceIndex 
};