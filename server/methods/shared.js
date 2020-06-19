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
