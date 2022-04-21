const isAdmin = (user, host) => {
  if (!user || !host) {
    return false;
  }
  return host.members.some(
    member => member.id === user._id && member.role === 'admin',
  );
};
const isContributorOrAdmin = (user, host) => {
  if (!user || !host) {
    return false;
  }

  return host.members.some(
    member =>
      member.id === user._id && ['admin', 'contributor'].includes(member.role),
  );
};
const isContributor = (user, host) => {
  if (!user || !host) {
    return false;
  }
  return host.members.some(
    member => member.id === user._id && member.role === 'contributor',
  );
};
const isParticipant = (user, host) => {
  if (!user || !host) {
    return false;
  }
  return host.members.some(
    member => member.id === user._id && member.role === 'participant',
  );
};
const isMember = (user, host) => {
  if (!user || !host) {
    return false;
  }
  return host.members.some(member => member.id === user._id);
};
export {
  isAdmin,
  isContributorOrAdmin,
  isContributor,
  isParticipant,
  isMember,
};
