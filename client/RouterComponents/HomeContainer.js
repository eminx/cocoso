import { withTracker } from 'meteor/react-meteor-data';
import Home from './Home';
 
export default HomeContainer = withTracker((props) => {
  //here we can pull out the props.subID and change our Meteor subscription based on it
  //this is handled on the publication side of things
  
  // const handle = Meteor.subscribe('myDataSub', props.subID);
  
  const gatherings = Meteor.subscribe('gatherings');
  const isLoading = !gatherings.ready();
  const gatheringsList = Gatherings ? Gatherings.find().fetch() : null;
  return {
    isLoading,
		gatherings,
		gatheringsList
  };
})(Home);