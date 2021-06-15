export const getResourceIndex = (resource, host) => {
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

export const getHost = (self) => self.connection.httpHeaders.host;

export const siteUrl = Meteor.absoluteUrl();

export const isMember = (user, host) => {
  if (!user || !host) {
    return false;
  }
  return host.members.some((member) => member.id === user._id);
};

export const isParticipant = (user, host) => {
  if (!user || !host) {
    return false;
  }
  return host.members.some(
    (member) => member.id === user._id && member.role === 'participant'
  );
};

export const isContributor = (user, host) => {
  if (!user || !host) {
    return false;
  }
  return host.members.some(
    (member) => member.id === user._id && member.role === 'contributor'
  );
};

export const isAdmin = (user, host) => {
  if (!user || !host) {
    return false;
  }
  return host.members.some(
    (member) => member.id === user._id && member.role === 'admin'
  );
};

export const isContributorOrAdmin = (user, host) => {
  if (!user || !host) {
    return false;
  }

  return host.members.some(
    (member) =>
      member.id === user._id && ['admin', 'contributor'].includes(member.role)
  );
};
