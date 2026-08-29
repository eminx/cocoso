import Memberships from '../memberships/membership';

const isAdmin = async (userId, host) => {
  if (!userId || !host) {
    return false;
  }
  return Boolean(
    await Memberships.findOneAsync({ userId, host, role: 'admin' })
  );
};
const isContributorOrAdmin = async (userId, host) => {
  if (!userId || !host) {
    return false;
  }
  return Boolean(
    await Memberships.findOneAsync({
      userId,
      host,
      role: { $in: ['admin', 'contributor'] },
    })
  );
};
const isContributor = async (userId, host) => {
  if (!userId || !host) {
    return false;
  }
  return Boolean(
    await Memberships.findOneAsync({ userId, host, role: 'contributor' })
  );
};
const isParticipant = async (userId, host) => {
  if (!userId || !host) {
    return false;
  }
  return Boolean(
    await Memberships.findOneAsync({ userId, host, role: 'participant' })
  );
};
const isMember = async (userId, host) => {
  if (!userId || !host) {
    return false;
  }
  return Boolean(await Memberships.findOneAsync({ userId, host }));
};
export { isAdmin, isContributorOrAdmin, isContributor, isParticipant, isMember };
