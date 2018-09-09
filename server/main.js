import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup

  const placesList = Places.find().fetch();
  console.log('placesList', placesList);
  Gatherings.find().forEach(gathering => {
  	placesList.forEach((place, i) => {
  		console.log('place, i:', i, place.name, gathering.room);
	    if (place.name === gathering.room) {
	      Gatherings.update(gathering._id, {
		  		$set: {
		  			roomIndex: i.toString()
		  		}
		  	});
	    }
	  });
  })
});
