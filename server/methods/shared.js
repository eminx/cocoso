export const getRoomIndex = room => {
  const placesList = Places.find().fetch();
  if (placesList.length > 0) {
    let roomIndex;
    placesList.forEach((place, i) => {
      if (place.name === room) {
        roomIndex = i.toString();
      }
    });
    return roomIndex;
  }
};

export const siteUrl = Meteor.absoluteUrl();
