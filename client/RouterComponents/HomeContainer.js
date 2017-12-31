import { withTracker } from 'meteor/react-meteor-data';
import Home from './Home';
 
export default HomeContainer = withTracker((props) => {
  //here we can pull out the props.subID and change our Meteor subscription based on it
  //this is handled on the publication side of things
  
  const handle = Meteor.subscribe('myDataSub', props.subID);
  
  return {
    dataReady: handle.ready(),
    myData: handle.ready() ? myDB.find({}).fetch() : [],
  };
})(Home);