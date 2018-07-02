import { withTracker } from 'meteor/react-meteor-data';
import Home from './Home';
import moment from 'moment';
 
export default HomeContainer = withTracker((props) => {
  //here we can pull out the props.subID and change our Meteor subscription based on it
  //this is handled on the publication side of things
  
  // const handle = Meteor.subscribe('myDataSub', props.subID);
  
  const gatherings = Meteor.subscribe('gatherings');
  const images = Meteor.subscribe('images');
  const isLoading = !gatherings.ready();
  const gatheringsList = Gatherings ? Gatherings.find().fetch() : null;
  const imagesArray = Images ? Images.find().fetch() : null;
  const currentUser = Meteor.user();
  const placesSub = Meteor.subscribe('places');
  const placesList = Places ? Places.find().fetch() : null;

  gatheringsList.forEach(gather => {
    gather.start = moment(gather.startDate + gather.startTime, 'YYYY-MM-DD HH:mm').toDate();
    gather.end = moment(gather.endDate + gather.endTime, 'YYYY-MM-DD HH:mm').toDate();
  });

  return {
    isLoading,
		gatherings,
		gatheringsList,
    imagesArray,
    currentUser,
    placesList
  };
})(Home);