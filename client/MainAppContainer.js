import { withTracker } from 'meteor/react-meteor-data';
import AppContainer from './MainAppContainer';
 
export default MainAppContainer = withTracker((props) => {
  //here we can pull out the props.subID and change our Meteor subscription based on it
  //this is handled on the publication side of things
  
  const handle = Meteor.subscribe('myDataSub', props.subID);
  
  return {
    dataReady: handle.ready(),
    myData: handle.ready() ? myDB.find({}).fetch() : [],
  };
})(AppContainer);