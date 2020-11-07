export const getRoomIndex = (room) => {
  const resourcesList = Resources.find().fetch();
  if (resourcesList.length > 0) {
    let roomIndex;
    resourcesList.forEach((place, i) => {
      if (place.name === room) {
        roomIndex = i.toString();
      }
    });
    return roomIndex;
  }
};

export const getHost = (self) => self.connection.httpHeaders.host;

export const siteUrl = Meteor.absoluteUrl();

export const isMember = (user, host) => {
  if (!user || !host) {
    return false;
  }
  host.members.some((member) => member.id === user._id);
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
