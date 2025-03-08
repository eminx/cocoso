const isAdmin = (user, Host) => {
  if (!user || !Host) {
    return false;
  }
  return Host.members.some((member) => member.id === user._id && member.role === 'admin');
};
const isContributorOrAdmin = (user, Host) => {
  if (!user || !Host) {
    return false;
  }

  return Host.members.some(
    (member) => member.id === user._id && ['admin', 'contributor'].includes(member.role)
  );
};
const isContributor = (user, Host) => {
  if (!user || !Host) {
    return false;
  }
  return Host.members.some((member) => member.id === user._id && member.role === 'contributor');
};
const isParticipant = (user, Host) => {
  if (!user || !Host) {
    return false;
  }
  return Host.members.some((member) => member.id === user._id && member.role === 'participant');
};
const isMember = (user, Host) => {
  if (!user || !Host) {
    return false;
  }
  return Host.members.some((member) => member.id === user._id);
};
export { isAdmin, isContributorOrAdmin, isContributor, isParticipant, isMember };
