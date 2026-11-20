import Memberships from '/imports/api/memberships/membership';
import Platform from '/imports/api/platform/platform';

const ROLE = 'participant';
const PORTAL_ROLE = 'participant';

export async function joinHost(userId, host) {
  const platform = await Platform.findOneAsync();
  if (!platform) {
    console.error('no platform!');
    return;
  }
  const isFederationLayout = platform.isFederationLayout;
  const portalHost = platform.portalHost;
  const isPortal = portalHost === host;
  const roleAssigned = isPortal ? PORTAL_ROLE : ROLE;
  console.log('isFederationLayout:', isFederationLayout);
  console.log('isPortal:', isPortal);
  console.log('platform:', platform);
  try {
    await Memberships.upsertAsync(
      { userId, host },
      {
        $setOnInsert: {
          role: roleAssigned,
          joinDate: new Date(),
          isPublic: true,
        },
      }
    );

    // if (isPortal || !isFederationLayout) return;
    if (isPortal) return;
    await Memberships.upsertAsync(
      { userId, portalHost },
      {
        $setOnInsert: {
          role: PORTAL_ROLE,
          joinDate: new Date(),
          isPublic: true,
        },
      }
    );
  } catch (error) {
    if (error.code === 11000) return;
    console.error('[oauth] join host failed', { userId, host, error });
  }
}
